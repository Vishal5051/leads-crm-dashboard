import { Request, Response, NextFunction } from 'express';
import Lead, { LeadStatus, LeadSource } from '../models/Lead';
import { ApiError } from '../utils/errors';
import mongoose from 'mongoose';

export const createLead = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { name, email, status, source } = req.body;
    if (!req.user) {
      throw new ApiError(401, 'Unauthorized');
    }

    const existingLead = await Lead.findOne({ email: email.toLowerCase() });
    if (existingLead) {
      throw new ApiError(400, 'A lead with this email address already exists');
    }

    const newLead = await Lead.create({
      name,
      email: email.toLowerCase(),
      status,
      source,
      createdBy: new mongoose.Types.ObjectId(req.user.id),
    });

    const populatedLead = await Lead.findById(newLead._id).populate('createdBy', 'name email');

    res.status(201).json({
      success: true,
      message: 'Lead created successfully',
      data: populatedLead,
    });
  } catch (error) {
    next(error);
  }
};

export const getLeads = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const status = req.query.status as LeadStatus | undefined;
    const source = req.query.source as LeadSource | undefined;
    const search = req.query.search as string | undefined;
    const sort = req.query.sort as string || 'Latest';

    const query: any = {};

    if (status) {
      query.status = status;
    }

    if (source) {
      query.source = source;
    }

    if (search) {
      // Direct partial matching for name and email provides a better real-time UX
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }

    // Determine sorting options
    let sortOptions: any = { createdAt: -1 };
    if (sort === 'Oldest') {
      sortOptions = { createdAt: 1 };
    }

    const skip = (page - 1) * limit;

    const totalRecords = await Lead.countDocuments(query);
    const totalPages = Math.ceil(totalRecords / limit);

    const leads = await Lead.find(query)
      .populate('createdBy', 'name email')
      .sort(sortOptions)
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      success: true,
      message: 'Leads retrieved successfully',
      data: leads,
      meta: {
        page,
        limit,
        totalPages,
        totalRecords,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getLeadById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new ApiError(400, 'Invalid Lead ID format');
    }

    const lead = await Lead.findById(id).populate('createdBy', 'name email');
    if (!lead) {
      throw new ApiError(404, 'Lead not found');
    }

    res.status(200).json({
      success: true,
      message: 'Lead retrieved successfully',
      data: lead,
    });
  } catch (error) {
    next(error);
  }
};

export const updateLead = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const { name, email, status, source } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new ApiError(400, 'Invalid Lead ID format');
    }

    const lead = await Lead.findById(id);
    if (!lead) {
      throw new ApiError(404, 'Lead not found');
    }

    if (email && email.toLowerCase() !== lead.email.toLowerCase()) {
      const existingLead = await Lead.findOne({ email: email.toLowerCase() });
      if (existingLead) {
        throw new ApiError(400, 'A lead with this email address already exists');
      }
      lead.email = email.toLowerCase();
    }

    if (name) lead.name = name;
    if (status) lead.status = status;
    if (source) lead.source = source;

    const updatedLead = await lead.save();
    const populatedLead = await Lead.findById(updatedLead._id).populate('createdBy', 'name email');

    res.status(200).json({
      success: true,
      message: 'Lead updated successfully',
      data: populatedLead,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteLead = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new ApiError(400, 'Invalid Lead ID format');
    }

    const lead = await Lead.findById(id);
    if (!lead) {
      throw new ApiError(404, 'Lead not found');
    }

    await lead.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Lead deleted successfully',
      data: { id },
    });
  } catch (error) {
    next(error);
  }
};

export const exportLeadsCSV = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const status = req.query.status as LeadStatus | undefined;
    const source = req.query.source as LeadSource | undefined;
    const search = req.query.search as string | undefined;
    const sort = req.query.sort as string || 'Latest';

    const query: any = {};

    if (status) query.status = status;
    if (source) query.source = source;
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }

    let sortOptions: any = { createdAt: -1 };
    if (sort === 'Oldest') sortOptions = { createdAt: 1 };

    const leads = await Lead.find(query)
      .populate('createdBy', 'name')
      .sort(sortOptions);

    // Format clean CSV with proper escaping
    const headers = 'ID,Name,Email,Status,Source,Created By,Created At\n';
    const rows = leads.map(lead => {
      const id = lead._id.toString();
      const name = `"${lead.name.replace(/"/g, '""')}"`;
      const email = `"${lead.email.replace(/"/g, '""')}"`;
      const leadStatus = lead.status;
      const leadSource = lead.source;
      const creator = lead.createdBy ? `"${(lead.createdBy as any).name.replace(/"/g, '""')}"` : 'Unknown';
      const date = lead.createdAt.toISOString();
      return `${id},${name},${email},${leadStatus},${leadSource},${creator},${date}`;
    }).join('\n');

    const csvContent = headers + rows;

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=leads_export.csv');
    res.status(200).send(csvContent);
  } catch (error) {
    next(error);
  }
};

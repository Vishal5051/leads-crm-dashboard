import { Router } from 'express';
import {
  createLead,
  getLeads,
  getLeadById,
  updateLead,
  deleteLead,
  exportLeadsCSV,
} from '../controllers/leadController';
import { leadValidator } from '../middleware/validator';
import { authenticate, authorize } from '../middleware/auth';

const router = Router();

// Protect all routes below with authentication
router.use(authenticate);

// Export leads to CSV - Admin-only feature
// Explicitly placing this BEFORE '/:id' to avoid routing clashes
router.get('/export/csv', authorize('Admin'), exportLeadsCSV);

// Lead operations
router.post('/', leadValidator, createLead);
router.get('/', getLeads);
router.get('/:id', getLeadById);
router.put('/:id', leadValidator, updateLead);

// Lead deletion - Admin-only action
router.delete('/:id', authorize('Admin'), deleteLead);

export default router;

import React, { useState } from 'react';
import { useLeads } from '../context/LeadContext';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { Modal } from '../components/Modal';
import { Drawer } from '../components/Drawer';
import { Skeleton } from '../components/Skeleton';
import type { Lead, LeadStatus, LeadSource } from '../types';
import {
  Plus,
  Search,
  Download,
  Trash2,
  Edit,
  Eye,
  Lock,
  Filter,
  TrendingUp,
  UserCheck,
  PhoneCall,
  Compass,
  Briefcase,
  Layers,
} from 'lucide-react';

export const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const {
    leads,
    isLoading,
    isExporting,
    meta,
    filters,
    setFilter,
    resetFilters,
    createLead,
    updateLead,
    deleteLead,
    exportLeads,
  } = useLeads();

  // Modal / Drawer States
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  // Active Lead Selections
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);

  // Form Field States
  const [formName, setFormName] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formStatus, setFormStatus] = useState<LeadStatus>('New');
  const [formSource, setFormSource] = useState<LeadSource>('Website');
  const [formError, setFormError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isAdmin = user?.role === 'Admin';

  // Open Handlers
  const handleOpenCreate = (): void => {
    setFormName('');
    setFormEmail('');
    setFormStatus('New');
    setFormSource('Website');
    setFormError('');
    setIsCreateOpen(true);
  };

  const handleOpenEdit = (lead: Lead): void => {
    setSelectedLead(lead);
    setFormName(lead.name);
    setFormEmail(lead.email);
    setFormStatus(lead.status);
    setFormSource(lead.source);
    setFormError('');
    setIsEditOpen(true);
  };

  const handleOpenDelete = (lead: Lead): void => {
    setSelectedLead(lead);
    setIsDeleteOpen(true);
  };

  const handleOpenDetail = (lead: Lead): void => {
    setSelectedLead(lead);
    setIsDetailOpen(true);
  };

  // Submit Handlers
  const handleCreateSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    if (!formName || !formEmail) {
      setFormError('Please fill in name and email');
      return;
    }
    setFormError('');
    setIsSubmitting(true);
    try {
      await createLead({
        name: formName,
        email: formEmail,
        status: formStatus,
        source: formSource,
      });
      setIsCreateOpen(false);
    } catch (err: any) {
      setFormError(err.message || 'Failed to create lead');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    if (!selectedLead) return;
    if (!formName || !formEmail) {
      setFormError('Please fill in name and email');
      return;
    }
    setFormError('');
    setIsSubmitting(true);
    try {
      await updateLead(selectedLead._id, {
        name: formName,
        email: formEmail,
        status: formStatus,
        source: formSource,
      });
      setIsEditOpen(false);
    } catch (err: any) {
      setFormError(err.message || 'Failed to update lead');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteSubmit = async (): Promise<void> => {
    if (!selectedLead) return;
    setIsSubmitting(true);
    try {
      await deleteLead(selectedLead._id);
      setIsDeleteOpen(false);
    } catch (err) {
      // errors handled by toast context
    } finally {
      setIsSubmitting(false);
    }
  };

  // Metric Computations (Calculated based on loaded list for real-time visual feedback)
  const totalRecords = meta.totalRecords;
  const contactedCount = leads.filter((l) => l.status === 'Contacted').length;
  const qualifiedCount = leads.filter((l) => l.status === 'Qualified').length;
  const conversionRate = totalRecords > 0 ? ((qualifiedCount / totalRecords) * 100).toFixed(1) : '0.0';

  return (
    <div className="flex flex-col gap-6 md:gap-8">
      {/* 1. Header Actions Grid */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl md:text-2xl font-bold font-display text-slate-900 dark:text-white">
            Lead Management
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Build relationships and track pipeline status
          </p>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          {/* CSV Export Button (RBAC protected) */}
          <Button
            variant="outline"
            className="flex-1 sm:flex-none text-xs gap-2 py-2"
            onClick={exportLeads}
            disabled={isExporting || !isAdmin}
            leftIcon={isAdmin ? <Download size={16} /> : <Lock size={14} className="text-slate-400" />}
          >
            Export CSV
          </Button>

          {/* Create Lead Button */}
          <Button
            variant="primary"
            className="flex-1 sm:flex-none text-xs gap-2 py-2"
            onClick={handleOpenCreate}
            leftIcon={<Plus size={16} />}
          >
            New Lead
          </Button>
        </div>
      </div>

      {/* 2. KPI Section Cards */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <div className="glass-card p-6 flex items-center gap-4 relative overflow-hidden">
          <div className="p-3 bg-indigo-500/10 rounded-xl text-indigo-500">
            <Layers size={22} />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Leads</p>
            <h3 className="text-xl md:text-2xl font-extrabold text-slate-900 dark:text-white mt-1">
              {totalRecords}
            </h3>
          </div>
        </div>

        <div className="glass-card p-6 flex items-center gap-4 relative overflow-hidden">
          <div className="p-3 bg-amber-500/10 rounded-xl text-amber-500">
            <PhoneCall size={22} />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Contacted</p>
            <h3 className="text-xl md:text-2xl font-extrabold text-slate-900 dark:text-white mt-1">
              {contactedCount}
            </h3>
          </div>
        </div>

        <div className="glass-card p-6 flex items-center gap-4 relative overflow-hidden">
          <div className="p-3 bg-emerald-500/10 rounded-xl text-emerald-500">
            <UserCheck size={22} />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Qualified</p>
            <h3 className="text-xl md:text-2xl font-extrabold text-slate-900 dark:text-white mt-1">
              {qualifiedCount}
            </h3>
          </div>
        </div>

        <div className="glass-card p-6 flex items-center gap-4 relative overflow-hidden">
          <div className="p-3 bg-pink-500/10 rounded-xl text-pink-500">
            <TrendingUp size={22} />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Conversion</p>
            <h3 className="text-xl md:text-2xl font-extrabold text-slate-900 dark:text-white mt-1">
              {conversionRate}%
            </h3>
          </div>
        </div>
      </section>

      {/* 3. Filtering Section */}
      <section className="glass-card p-4 md:p-5 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Combined Inputs Group */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full md:w-auto flex-1">
          {/* 1. Global text search */}
          <Input
            placeholder="Search name, email..."
            value={filters.search}
            onChange={(e) => setFilter('search', e.target.value)}
            leftIcon={<Search size={16} />}
            className="bg-transparent py-1.5"
          />

          {/* 2. Status drop filter */}
          <div className="relative">
            <select
              value={filters.status}
              onChange={(e) => setFilter('status', e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl pl-9 pr-4 py-2 text-sm transition-all outline-none font-medium text-slate-700 dark:text-slate-300 appearance-none cursor-pointer"
            >
              <option value="">All Statuses</option>
              <option value="New">🟢 New</option>
              <option value="Contacted">🔵 Contacted</option>
              <option value="Qualified">🟣 Qualified</option>
              <option value="Lost">🔴 Lost</option>
            </select>
            <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 pointer-events-none">
              <Filter size={14} />
            </div>
            <div className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 pointer-events-none text-xs">
              ▼
            </div>
          </div>

          {/* 3. Source drop filter */}
          <div className="relative">
            <select
              value={filters.source}
              onChange={(e) => setFilter('source', e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl pl-9 pr-4 py-2 text-sm transition-all outline-none font-medium text-slate-700 dark:text-slate-300 appearance-none cursor-pointer"
            >
              <option value="">All Sources</option>
              <option value="Website">🌐 Website</option>
              <option value="Instagram">📸 Instagram</option>
              <option value="Referral">🤝 Referral</option>
            </select>
            <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 pointer-events-none">
              <Compass size={14} />
            </div>
            <div className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 pointer-events-none text-xs">
              ▼
            </div>
          </div>
        </div>

        {/* Sorting controls */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-end border-t md:border-t-0 pt-3 md:pt-0 border-slate-100 dark:border-slate-900">
          <div className="relative w-36">
            <select
              value={filters.sort}
              onChange={(e) => setFilter('sort', e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl pl-3 pr-8 py-2 text-sm transition-all outline-none font-medium text-slate-700 dark:text-slate-300 appearance-none cursor-pointer"
            >
              <option value="Latest">📅 Latest</option>
              <option value="Oldest">⏳ Oldest</option>
            </select>
            <div className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 pointer-events-none text-xs">
              ▼
            </div>
          </div>

          <Button
            variant="ghost"
            onClick={resetFilters}
            className="text-xs py-2 px-3 border border-dashed border-slate-300 dark:border-slate-800 hover:border-slate-400"
          >
            Reset
          </Button>
        </div>
      </section>

      {/* 4. Leads Table & Shimmers View */}
      {isLoading ? (
        <div className="glass-card p-6 flex flex-col gap-4">
          <Skeleton variant="text" className="h-10" />
          <Skeleton variant="rect" className="h-64" />
        </div>
      ) : leads.length === 0 ? (
        // Illustrated beautiful Empty State
        <div className="glass-card p-12 text-center flex flex-col items-center justify-center">
          <div className="h-16 w-16 rounded-full bg-slate-100 dark:bg-slate-900 flex items-center justify-center text-slate-400 mb-4 border border-slate-200 dark:border-slate-850">
            <Compass size={28} />
          </div>
          <h4 className="text-lg font-bold font-display text-slate-900 dark:text-white">
            No leads found
          </h4>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-sm">
            Try adjusting search queries, changing filtering tags, or create a brand new lead.
          </p>
          <Button variant="outline" className="mt-4 text-xs" onClick={handleOpenCreate}>
            Add First Lead
          </Button>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {/* Table Container */}
          <div className="glass-card overflow-x-auto relative">
            <table className="w-full text-left border-collapse min-w-[700px]">
              <thead className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/20 text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider text-[11px] font-display">
                <tr>
                  <th className="py-4 px-6">Name</th>
                  <th className="py-4 px-6">Email Address</th>
                  <th className="py-4 px-6">Status</th>
                  <th className="py-4 px-6">Source</th>
                  <th className="py-4 px-6">Created At</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-150 dark:divide-slate-900 text-sm font-medium text-slate-700 dark:text-slate-300">
                {leads.map((lead) => {
                  return (
                    <tr
                      key={lead._id}
                      className="hover:bg-slate-50/40 dark:hover:bg-slate-900/30 transition-colors duration-150"
                    >
                      <td className="py-4 px-6">
                        <span className="font-semibold text-slate-900 dark:text-white">
                          {lead.name}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <span className="text-slate-500 dark:text-slate-400">{lead.email}</span>
                      </td>
                      <td className="py-4 px-6">
                        <span
                          className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${
                            lead.status === 'Qualified'
                              ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                              : lead.status === 'Contacted'
                              ? 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20'
                              : lead.status === 'Lost'
                              ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20'
                              : 'bg-slate-200/50 text-slate-600 dark:bg-slate-800/50 dark:text-slate-400 border border-slate-300/10'
                          }`}
                        >
                          {lead.status}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <span className="inline-flex items-center gap-1 text-slate-500 dark:text-slate-450">
                          {lead.source === 'Website' && <Compass size={14} className="text-blue-500" />}
                          {lead.source === 'Instagram' && <Briefcase size={14} className="text-pink-500" />}
                          {lead.source === 'Referral' && <UserCheck size={14} className="text-amber-500" />}
                          {lead.source}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <span className="text-xs text-slate-400 dark:text-slate-500">
                          {new Date(lead.createdAt).toLocaleDateString()}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleOpenDetail(lead)}
                            title="View details"
                            className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-500 hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors"
                          >
                            <Eye size={16} />
                          </button>
                          <button
                            onClick={() => handleOpenEdit(lead)}
                            title="Edit lead"
                            className="p-1.5 rounded-lg text-slate-400 hover:text-pink-500 hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors"
                          >
                            <Edit size={16} />
                          </button>
                          <button
                            onClick={() => handleOpenDelete(lead)}
                            disabled={!isAdmin}
                            title={isAdmin ? 'Delete lead' : 'Delete (Admin only)'}
                            className={`p-1.5 rounded-lg transition-colors ${
                              isAdmin
                                ? 'text-slate-400 hover:text-rose-500 hover:bg-rose-500/10'
                                : 'text-slate-300 dark:text-slate-700 cursor-not-allowed'
                            }`}
                          >
                            {isAdmin ? <Trash2 size={16} /> : <Lock size={14} />}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* 5. Pagination Metadata block */}
          <div className="flex items-center justify-between border-t border-slate-200 dark:border-slate-800 pt-4 text-xs font-semibold text-slate-500 dark:text-slate-400">
            <span>
              Showing Page {meta.page} of {meta.totalPages} ({meta.totalRecords} leads)
            </span>
            <div className="flex gap-2">
              <Button
                variant="outline"
                className="py-1 px-3 text-xs"
                disabled={meta.page <= 1}
                onClick={() => setFilter('page', meta.page - 1)}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                className="py-1 px-3 text-xs"
                disabled={meta.page >= meta.totalPages}
                onClick={() => setFilter('page', meta.page + 1)}
              >
                Next
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 6. MODALS & DRAWERS SECTION */}
      {/* ========================================================================= */}

      {/* A. Create Lead Modal */}
      <Modal isOpen={isCreateOpen} onClose={() => setIsCreateOpen(false)} title="Add New Lead">
        <form onSubmit={handleCreateSubmit} className="flex flex-col gap-4">
          {formError && (
            <div className="p-3 bg-rose-500/10 border border-rose-500/20 text-rose-500 rounded-xl text-xs font-medium">
              {formError}
            </div>
          )}

          <Input
            label="Lead Name"
            placeholder="e.g. Alice Smith"
            value={formName}
            onChange={(e) => setFormName(e.target.value)}
            required
          />

          <Input
            label="Email Address"
            type="email"
            placeholder="e.g. alice@acme.com"
            value={formEmail}
            onChange={(e) => setFormEmail(e.target.value)}
            required
          />

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold tracking-wider text-slate-500 dark:text-slate-400 uppercase font-display">
                Status
              </label>
              <select
                value={formStatus}
                onChange={(e) => setFormStatus(e.target.value as LeadStatus)}
                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2.5 text-sm transition-all outline-none font-medium text-slate-700 dark:text-slate-350 cursor-pointer"
              >
                <option value="New">New</option>
                <option value="Contacted">Contacted</option>
                <option value="Qualified">Qualified</option>
                <option value="Lost">Lost</option>
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold tracking-wider text-slate-500 dark:text-slate-400 uppercase font-display">
                Source
              </label>
              <select
                value={formSource}
                onChange={(e) => setFormSource(e.target.value as LeadSource)}
                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2.5 text-sm transition-all outline-none font-medium text-slate-700 dark:text-slate-350 cursor-pointer"
              >
                <option value="Website">Website</option>
                <option value="Instagram">Instagram</option>
                <option value="Referral">Referral</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-3 border-t border-slate-100 dark:border-slate-900 pt-4 mt-2">
            <Button type="button" variant="ghost" onClick={() => setIsCreateOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" isLoading={isSubmitting}>
              Add Lead
            </Button>
          </div>
        </form>
      </Modal>

      {/* B. Edit Lead Modal */}
      <Modal isOpen={isEditOpen} onClose={() => setIsEditOpen(false)} title="Edit Lead Details">
        <form onSubmit={handleEditSubmit} className="flex flex-col gap-4">
          {formError && (
            <div className="p-3 bg-rose-500/10 border border-rose-500/20 text-rose-500 rounded-xl text-xs font-medium">
              {formError}
            </div>
          )}

          <Input
            label="Lead Name"
            placeholder="e.g. Alice Smith"
            value={formName}
            onChange={(e) => setFormName(e.target.value)}
            required
          />

          <Input
            label="Email Address"
            type="email"
            placeholder="e.g. alice@acme.com"
            value={formEmail}
            onChange={(e) => setFormEmail(e.target.value)}
            required
          />

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold tracking-wider text-slate-500 dark:text-slate-400 uppercase font-display">
                Status
              </label>
              <select
                value={formStatus}
                onChange={(e) => setFormStatus(e.target.value as LeadStatus)}
                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2.5 text-sm transition-all outline-none font-medium text-slate-700 dark:text-slate-350 cursor-pointer"
              >
                <option value="New">New</option>
                <option value="Contacted">Contacted</option>
                <option value="Qualified">Qualified</option>
                <option value="Lost">Lost</option>
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold tracking-wider text-slate-500 dark:text-slate-400 uppercase font-display">
                Source
              </label>
              <select
                value={formSource}
                onChange={(e) => setFormSource(e.target.value as LeadSource)}
                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2.5 text-sm transition-all outline-none font-medium text-slate-700 dark:text-slate-350 cursor-pointer"
              >
                <option value="Website">Website</option>
                <option value="Instagram">Instagram</option>
                <option value="Referral">Referral</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-3 border-t border-slate-100 dark:border-slate-900 pt-4 mt-2">
            <Button type="button" variant="ghost" onClick={() => setIsEditOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" isLoading={isSubmitting}>
              Save Changes
            </Button>
          </div>
        </form>
      </Modal>

      {/* C. Delete Lead Confirmation Modal */}
      <Modal isOpen={isDeleteOpen} onClose={() => setIsDeleteOpen(false)} title="Confirm Deletion">
        <div className="flex flex-col gap-3 text-left">
          <p className="text-sm text-slate-600 dark:text-slate-400 leading-6">
            Are you sure you want to permanently delete lead{' '}
            <strong className="text-slate-900 dark:text-white">
              {selectedLead?.name} ({selectedLead?.email})
            </strong>
            ? This action is irreversible.
          </p>
          <div className="flex justify-end gap-3 border-t border-slate-100 dark:border-slate-900 pt-4 mt-4">
            <Button type="button" variant="ghost" onClick={() => setIsDeleteOpen(false)}>
              Cancel
            </Button>
            <Button type="button" variant="danger" isLoading={isSubmitting} onClick={handleDeleteSubmit}>
              Delete Lead
            </Button>
          </div>
        </div>
      </Modal>

      {/* D. Lead detail Drawer */}
      <Drawer
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        title="Lead Information Details"
      >
        {selectedLead && (
          <div className="flex flex-col gap-6 text-left">
            <div className="flex items-center gap-4 border-b border-slate-100 dark:border-slate-900 pb-4">
              <div className="h-14 w-14 rounded-2xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-extrabold text-lg">
                {selectedLead.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <h4 className="text-lg font-bold text-slate-900 dark:text-white font-display leading-6">
                  {selectedLead.name}
                </h4>
                <p className="text-xs text-slate-450 dark:text-slate-500 mt-0.5">{selectedLead.email}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1 bg-slate-50 dark:bg-slate-900/40 p-3 rounded-xl border border-slate-100 dark:border-slate-800/30">
                <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">Status</span>
                <span className="text-sm font-semibold text-slate-800 dark:text-slate-200 mt-0.5">
                  {selectedLead.status}
                </span>
              </div>
              <div className="flex flex-col gap-1 bg-slate-50 dark:bg-slate-900/40 p-3 rounded-xl border border-slate-100 dark:border-slate-800/30">
                <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">Source</span>
                <span className="text-sm font-semibold text-slate-800 dark:text-slate-200 mt-0.5">
                  {selectedLead.source}
                </span>
              </div>
            </div>

            <div className="flex flex-col gap-3.5 bg-slate-50 dark:bg-slate-900/40 p-4 rounded-xl border border-slate-100 dark:border-slate-800/30 text-xs">
              <div className="flex justify-between">
                <span className="font-bold text-slate-400 uppercase tracking-wider">Lead Created At</span>
                <span className="font-semibold text-slate-700 dark:text-slate-300">
                  {new Date(selectedLead.createdAt).toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between border-t border-slate-200 dark:border-slate-800 pt-3">
                <span className="font-bold text-slate-400 uppercase tracking-wider">Account Manager</span>
                <span className="font-semibold text-slate-700 dark:text-slate-300">
                  {selectedLead.createdBy?.name || 'Unknown Manager'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="font-bold text-slate-400 uppercase tracking-wider">Manager Contact</span>
                <span className="font-medium text-slate-500 dark:text-slate-400">
                  {selectedLead.createdBy?.email || 'Unknown Email'}
                </span>
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6 border-t border-slate-100 dark:border-slate-900 pt-4">
              <Button
                variant="outline"
                className="text-xs"
                onClick={() => {
                  setIsDetailOpen(false);
                  handleOpenEdit(selectedLead);
                }}
              >
                Edit Details
              </Button>
              <Button variant="ghost" className="text-xs" onClick={() => setIsDetailOpen(false)}>
                Close Panel
              </Button>
            </div>
          </div>
        )}
      </Drawer>
    </div>
  );
};

import React, { createContext, useContext, useState, useEffect } from 'react';
import type { Lead, PaginationMeta } from '../types';
import { leadService } from '../services/leadService';
import { useDebounce } from '../hooks/useDebounce';
import { useToast } from './ToastContext';

interface LeadContextType {
  leads: Lead[];
  isLoading: boolean;
  isExporting: boolean;
  meta: PaginationMeta;
  filters: {
    search: string;
    status: string;
    source: string;
    sort: string;
    page: number;
    limit: number;
  };
  setFilter: (key: string, value: any) => void;
  resetFilters: () => void;
  fetchLeads: () => Promise<void>;
  createLead: (payload: any) => Promise<void>;
  updateLead: (id: string, payload: any) => Promise<void>;
  deleteLead: (id: string) => Promise<void>;
  exportLeads: () => Promise<void>;
}

const LeadContext = createContext<LeadContextType | undefined>(undefined);

export const LeadProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { addToast } = useToast();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [meta, setMeta] = useState<PaginationMeta>({
    page: 1,
    limit: 10,
    totalPages: 1,
    totalRecords: 0,
  });

  const [filters, setFilters] = useState({
    search: '',
    status: '',
    source: '',
    sort: 'Latest',
    page: 1,
    limit: 10,
  });

  const debouncedSearch = useDebounce(filters.search, 400);

  const fetchLeads = async (): Promise<void> => {
    setIsLoading(true);
    try {
      const response = await leadService.getAll({
        page: filters.page,
        limit: filters.limit,
        sort: filters.sort,
        status: filters.status || undefined,
        source: filters.source || undefined,
        search: debouncedSearch || undefined,
      });

      if (response.success && response.data) {
        setLeads(response.data);
        if (response.meta) {
          setMeta(response.meta);
        }
      }
    } catch (error: any) {
      addToast(error.message || 'Failed to fetch leads', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, [
    debouncedSearch,
    filters.status,
    filters.source,
    filters.sort,
    filters.page,
    filters.limit,
  ]);

  const setFilter = (key: string, value: any): void => {
    setFilters((prev) => {
      const nextFilters = { ...prev, [key]: value };
      // When filters change, reset pagination to page 1 to prevent out-of-bounds page requests
      if (key === 'status' || key === 'source' || key === 'search') {
        nextFilters.page = 1;
      }
      return nextFilters;
    });
  };

  const resetFilters = (): void => {
    setFilters({
      search: '',
      status: '',
      source: '',
      sort: 'Latest',
      page: 1,
      limit: 10,
    });
    addToast('Filters reset successfully', 'info');
  };

  const createLead = async (payload: any): Promise<void> => {
    try {
      const response = await leadService.create(payload);
      if (response.success) {
        addToast('Lead created successfully', 'success');
        fetchLeads(); // refresh leads
      }
    } catch (error: any) {
      addToast(error.message || 'Failed to create lead', 'error');
      throw error;
    }
  };

  const updateLead = async (id: string, payload: any): Promise<void> => {
    try {
      const response = await leadService.update(id, payload);
      if (response.success) {
        addToast('Lead updated successfully', 'success');
        fetchLeads(); // refresh leads
      }
    } catch (error: any) {
      addToast(error.message || 'Failed to update lead', 'error');
      throw error;
    }
  };

  const deleteLead = async (id: string): Promise<void> => {
    try {
      const response = await leadService.delete(id);
      if (response.success) {
        addToast('Lead deleted successfully', 'success');
        fetchLeads(); // refresh leads
      }
    } catch (error: any) {
      addToast(error.message || 'Failed to delete lead', 'error');
      throw error;
    }
  };

  const exportLeads = async (): Promise<void> => {
    setIsExporting(true);
    try {
      const blob = await leadService.exportCSV({
        search: debouncedSearch || undefined,
        status: filters.status || undefined,
        source: filters.source || undefined,
        sort: filters.sort,
      });

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `leads_export_${Date.now()}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      addToast('Leads exported successfully', 'success');
    } catch (error: any) {
      addToast(error.message || 'Failed to export CSV', 'error');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <LeadContext.Provider
      value={{
        leads,
        isLoading,
        isExporting,
        meta,
        filters,
        setFilter,
        resetFilters,
        fetchLeads,
        createLead,
        updateLead,
        deleteLead,
        exportLeads,
      }}
    >
      {children}
    </LeadContext.Provider>
  );
};

export const useLeads = () => {
  const context = useContext(LeadContext);
  if (!context) throw new Error('useLeads must be used within LeadProvider');
  return context;
};

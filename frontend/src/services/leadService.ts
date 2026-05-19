import API from './api';
import type { ApiResponse, Lead } from '../types';

export const leadService = {
  create: async (payload: any): Promise<ApiResponse<Lead>> => {
    const response = await API.post<ApiResponse<Lead>>('/leads', payload);
    return response.data;
  },

  getAll: async (params?: {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
    source?: string;
    sort?: string;
  }): Promise<ApiResponse<Lead[]>> => {
    const response = await API.get<ApiResponse<Lead[]>>('/leads', { params });
    return response.data;
  },

  getById: async (id: string): Promise<ApiResponse<Lead>> => {
    const response = await API.get<ApiResponse<Lead>>(`/leads/${id}`);
    return response.data;
  },

  update: async (id: string, payload: any): Promise<ApiResponse<Lead>> => {
    const response = await API.put<ApiResponse<Lead>>(`/leads/${id}`, payload);
    return response.data;
  },

  delete: async (id: string): Promise<ApiResponse<{ id: string }>> => {
    const response = await API.delete<ApiResponse<{ id: string }>>(`/leads/${id}`);
    return response.data;
  },

  exportCSV: async (params?: {
    search?: string;
    status?: string;
    source?: string;
    sort?: string;
  }): Promise<Blob> => {
    // Download as a Blob to leverage the Axios Authorization header interceptor safely
    const response = await API.get('/leads/export/csv', {
      params,
      responseType: 'blob',
    });
    return response.data;
  },
};

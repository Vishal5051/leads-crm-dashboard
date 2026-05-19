import API from './api';
import type { ApiResponse, User } from '../types';

export interface AuthResponseData {
  token: string;
  user: User;
}

export const authService = {
  register: async (payload: any): Promise<ApiResponse<AuthResponseData>> => {
    const response = await API.post<ApiResponse<AuthResponseData>>('/auth/register', payload);
    return response.data;
  },

  login: async (payload: any): Promise<ApiResponse<AuthResponseData>> => {
    const response = await API.post<ApiResponse<AuthResponseData>>('/auth/login', payload);
    return response.data;
  },

  getMe: async (): Promise<ApiResponse<{ user: User }>> => {
    const response = await API.get<ApiResponse<{ user: User }>>('/auth/me');
    return response.data;
  },
};

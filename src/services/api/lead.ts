import { api } from '@/lib/api';
import type { Lead, Communication } from '@/lib/types';

export interface LeadCreate {
  name: string;
  email: string;
  phone: string;
  propertyInterest?: string;
  notes?: string;
  source?: string;
}

export interface LeadUpdate extends Partial<LeadCreate> {
  status?: 'new' | 'contacted' | 'qualified' | 'lost';
}

export interface LeadSearchParams {
  page?: number;
  limit?: number;
  status?: LeadUpdate['status'];
  sortBy?: 'date' | 'name' | 'status';
  sortOrder?: 'asc' | 'desc';
  search?: string;
}

export const leadApi = {
  getAll: async (params?: LeadSearchParams) => {
    const { data } = await api.get<Lead[]>('/leads', { params });
    return data;
  },
  
  getById: async (id: string) => {
    const { data } = await api.get<Lead>(`/leads/${id}`);
    return data;
  },
  
  create: async (leadData: LeadCreate) => {
    const { data } = await api.post<Lead>('/leads', leadData);
    return data;
  },
  
  update: async (id: string, updateData: LeadUpdate) => {
    const { data } = await api.put<Lead>(`/leads/${id}`, updateData);
    return data;
  },
  
  delete: async (id: string) => {
    await api.delete(`/leads/${id}`);
  },
  
  addCommunication: async (id: string, message: string) => {
    const { data } = await api.post<Communication>(`/leads/${id}/communications`, { 
      message,
      timestamp: new Date().toISOString()
    });
    return data;
  },

  getCommunications: async (id: string) => {
    const { data } = await api.get<Communication[]>(`/leads/${id}/communications`);
    return data;
  }
};
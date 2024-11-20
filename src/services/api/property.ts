import { api } from '@/lib/api';
import { PropertySearchParams, PropertySearchResponse } from '@/lib/types/property';
import { formatZipCode, normalizeZipCode, isValidZipCode } from '@/utils/format';

export interface PropertyFilters {
  minPrice?: number;
  maxPrice?: number;
  bedrooms?: number;
  bathrooms?: number;
  propertyType?: 'single-family' | 'multi-family' | 'condo' | 'townhouse';
  yearBuilt?: number;
  squareFeet?: number;
}

export const propertyApi = {
  search: async (params: PropertySearchParams): Promise<PropertySearchResponse> => {
    try {
      if (params.zipCode && !isValidZipCode(params.zipCode)) {
        throw new Error('Invalid ZIP code format. Please use 5 digits (e.g., "02114")');
      }

      const queryParams = {
        ...params,
        zipCode: params.zipCode ? normalizeZipCode(params.zipCode) : undefined
      };

      console.log('Making API request with params:', queryParams);
      const { data } = await api.get<PropertySearchResponse>('/api/properties/search', { 
        params: queryParams 
      });
      console.log('Received API response:', data);
      
      return data;
    } catch (error) {
      console.error('Error searching properties:', error);
      throw error;
    }
  },

  getZipCodes: async (): Promise<string[]> => {
    try {
      const { data } = await api.get<number[]>('/api/properties/zip-codes');
      return data.map(zip => formatZipCode(zip));
    } catch (error) {
      console.error('Error fetching zip codes:', error);
      throw error;
    }
  },

  getDetails: async (id: string): Promise<PropertySearchResponse> => {
    try {
      const { data } = await api.get<PropertySearchResponse>(`/api/properties/${id}`);
      return data;
    } catch (error) {
      console.error(`Error getting property details for id ${id}:`, error);
      throw error;
    }
  },

  getSimilar: async (id: string, limit = 3): Promise<PropertySearchResponse> => {
    try {
      const { data } = await api.get<PropertySearchResponse>(`/api/properties/${id}/similar`, {
        params: { limit }
      });
      return data;
    } catch (error) {
      console.error(`Error getting similar properties for id ${id}:`, error);
      throw error;
    }
  },

  getFeatured: async (limit = 6): Promise<PropertySearchResponse> => {
    try {
      const { data } = await api.get<PropertySearchResponse>('/api/properties/featured', {
        params: { limit }
      });
      return data;
    } catch (error) {
      console.error('Error getting featured properties:', error);
      throw error;
    }
  }
};
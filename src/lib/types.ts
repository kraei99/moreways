// src/lib/types.ts
import { PAGE_SIZE } from './constants';

export interface User {
  id: string;
  username: string;
  email: string;
  role: 'user' | 'admin';
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface Property {
  address: {
    streetNumber: number;      // Maps to st_num
    streetName: string;        // Maps to st_name
    city: string;             // Maps to city
    zipCode: string;          // Maps to zip_code
    fullAddress: string;      // Computed from st_num + st_name
  };
  details: {
    livingArea: number;       // Maps to living_area
    pricePerSqFt: number;    // Maps to sale_price_per_sf
    buildingStyle: string;   // Maps to building_style
    propertyType: string;    // Maps to lu_desc
    bedrooms: number | null; // Not in current DB
    fullBaths: number | null; // Not in current DB
    halfBaths: number | null; // Not in current DB
  };
  financial: {
    value: number;           // Maps to sale_price
    taxAmount: number | null; // Not in current DB
    landValue: number | null; // Not in current DB
    buildingValue: number | null; // Not in current DB
  };
  features: {
    yearBuilt: number | null;      // Not in current DB
    yearRemodeled?: number | null; // Not in current DB
    totalRooms: number | null;     // Not in current DB
    condition: string | null;      // Not in current DB
  };
}

export interface PaginationParams {
  page?: number;
  pageSize?: number;
}

export interface SortParams {
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export const DEFAULT_PAGINATION: PaginationParams = {
  page: 1,
  pageSize: PAGE_SIZE
};

export const DEFAULT_SORT: SortParams = {
  sortBy: 'value',
  sortOrder: 'desc'
};

// You can extend these interfaces for specific features
export interface PropertySearchParams extends PaginationParams, SortParams {
  zipCode?: string;
  filters?: {
    minPrice?: number;
    maxPrice?: number;
    propertyType?: string;
    buildingStyle?: string;
  };
}
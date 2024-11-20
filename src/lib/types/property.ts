// Remove PAGE_SIZE from here since it's in constants.ts
export interface PropertyTableItem {
  id: string;
  address: string;
  city: string;
  zipCode: string;
  totalValue: number;
  livingArea: number;
  bedrooms: number | null;    // Made nullable since these don't exist in DB
  bathrooms: number | null;   // Made nullable since these don't exist in DB
  yearBuilt: number | null;   // Made nullable since these don't exist in DB
  propertyType: string;
  buildingStyle: string;
  taxes: number | null;       // Made nullable since these don't exist in DB
}

export interface PropertySearchParams {
  zipCode?: string;
  page?: number;
  pageSize?: number;         // Added pageSize
  sortBy?: keyof PropertyTableItem;
  sortOrder?: 'asc' | 'desc';
  filters?: {               // Added filters
    minPrice?: number;
    maxPrice?: number;
    propertyType?: string;
    buildingStyle?: string;
  };
}

export interface PropertySearchResponse {
  items: PropertyTableItem[];
  total: number;
  page: number;
  pageSize: number;
}
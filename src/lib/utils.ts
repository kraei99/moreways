// src/lib/utils.ts
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

// Tailwind class merging utility
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Format currency values consistently
export function formatCurrency(value: number | null | undefined): string {
  if (value == null) return 'N/A';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

// Format numbers with commas and handle nulls
export function formatNumber(value: number | null | undefined): string {
  if (value == null) return 'N/A';
  return new Intl.NumberFormat('en-US').format(value);
}

// Format area in square feet
export function formatArea(sqft: number | null | undefined): string {
  if (sqft == null) return 'N/A';
  return `${formatNumber(sqft)} sq ft`;
}

// Format price per square foot
export function formatPricePerSqFt(price: number | null | undefined): string {
  if (price == null) return 'N/A';
  return `${formatCurrency(price)}/sqft`;
}

// Validate ZIP code format
export function isValidZipCode(zipCode: string): boolean {
  return /^\d{5}$/.test(zipCode);
}

// Normalize ZIP code (ensure 5 digits with leading zeros)
export function normalizeZipCode(zipCode: string): string {
  return zipCode.padStart(5, '0');
}

// Format a full address from components
export function formatFullAddress(streetNumber: number, streetName: string): string {
  return `${streetNumber} ${streetName}`.trim();
}

// Format a complete address with city and ZIP
export function formatCompleteAddress(streetNumber: number, streetName: string, city: string, zipCode: string): string {
  return `${formatFullAddress(streetNumber, streetName)}, ${city}, ${zipCode}`;
}

// Calculate price per square foot
export function calculatePricePerSqFt(price: number, sqft: number): number | null {
  if (!price || !sqft) return null;
  return Math.round(price / sqft);
}

// Format year (handle nulls and invalid years)
export function formatYear(year: number | null | undefined): string {
  if (!year || year < 1600 || year > new Date().getFullYear()) return 'N/A';
  return year.toString();
}

// Sort properties by nested key
export function sortByKey<T>(array: T[], key: string, order: 'asc' | 'desc' = 'asc'): T[] {
  return [...array].sort((a, b) => {
    const valueA = getNestedValue(a, key);
    const valueB = getNestedValue(b, key);
    
    if (valueA == null) return order === 'asc' ? 1 : -1;
    if (valueB == null) return order === 'asc' ? -1 : 1;
    
    if (typeof valueA === 'string' && typeof valueB === 'string') {
      return order === 'asc' 
        ? valueA.localeCompare(valueB)
        : valueB.localeCompare(valueA);
    }
    
    return order === 'asc'
      ? Number(valueA) - Number(valueB)
      : Number(valueB) - Number(valueA);
  });
}

// Get value from nested object key (e.g., 'address.city')
export function getNestedValue(obj: any, path: string): any {
  return path.split('.').reduce((prev, curr) => {
    return prev ? prev[curr] : null;
  }, obj);
}

// Format property stats for display
export interface PropertyStats {
  total: number;
  average: number;
  median: number;
  min: number;
  max: number;
}

export function calculatePropertyStats(values: number[]): PropertyStats | null {
  if (!values.length) return null;
  
  const sortedValues = [...values].sort((a, b) => a - b);
  const total = values.reduce((sum, val) => sum + val, 0);
  
  return {
    total: values.length,
    average: Math.round(total / values.length),
    median: sortedValues[Math.floor(values.length / 2)],
    min: sortedValues[0],
    max: sortedValues[values.length - 1]
  };
}

// Format percentage
export function formatPercentage(value: number | null | undefined, decimals: number = 1): string {
  if (value == null) return 'N/A';
  return `${value.toFixed(decimals)}%`;
}

// Validate property data
export interface PropertyValidationError {
  field: string;
  message: string;
}

export function validatePropertyData(data: any): PropertyValidationError[] {
  const errors: PropertyValidationError[] = [];

  if (!data.address?.streetNumber) {
    errors.push({ field: 'streetNumber', message: 'Street number is required' });
  }
  
  if (!data.address?.streetName) {
    errors.push({ field: 'streetName', message: 'Street name is required' });
  }
  
  if (!data.address?.zipCode || !isValidZipCode(data.address.zipCode)) {
    errors.push({ field: 'zipCode', message: 'Valid ZIP code is required' });
  }
  
  if (!data.financial?.value || data.financial.value <= 0) {
    errors.push({ field: 'value', message: 'Valid property value is required' });
  }
  
  if (!data.details?.livingArea || data.details.livingArea <= 0) {
    errors.push({ field: 'livingArea', message: 'Valid living area is required' });
  }

  return errors;
}
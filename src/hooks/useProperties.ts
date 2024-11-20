import { useQuery } from '@tanstack/react-query';
import { propertyApi } from '@/services/api/property';
import type { PropertySearchParams, PropertySearchResponse } from '@/lib/types/property';
import { PAGE_SIZE } from '../lib/constants';


type QueryError = Error;

export function usePropertySearch(params: PropertySearchParams) {
  const queryParams = {
    ...params,
    pageSize: PAGE_SIZE
  };

  return useQuery<PropertySearchResponse, QueryError>({
    queryKey: ['properties', queryParams],
    queryFn: () => propertyApi.search(queryParams),
    enabled: Boolean(params.zipCode)
  });
}

export function usePropertyDetails(id: string) {
  return useQuery<PropertySearchResponse, QueryError>({
    queryKey: ['property', id],
    queryFn: () => propertyApi.getDetails(id),
    enabled: Boolean(id)
  });
}

export function useSimilarProperties(id: string, limit?: number) {
  return useQuery<PropertySearchResponse, QueryError>({
    queryKey: ['property', id, 'similar'],
    queryFn: () => propertyApi.getSimilar(id, limit),
    enabled: Boolean(id)
  });
}

export function useFeaturedProperties(limit?: number) {
  return useQuery<PropertySearchResponse, QueryError>({
    queryKey: ['properties', 'featured', limit],
    queryFn: () => propertyApi.getFeatured(limit)
  });
}
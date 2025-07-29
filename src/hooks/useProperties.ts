import { useQuery } from '@tanstack/react-query';
import { PropertyService } from '../services/propertyService';
import type { PropertiesResponse, SearchFilters } from '../types/Property';

export const useProperties = (
  page: number = 1,
  pageSize: number = 25,
  filters?: SearchFilters
) => {
  return useQuery<PropertiesResponse, Error>({
    queryKey: ['properties', page, pageSize, filters],
    queryFn: () => PropertyService.fetchProperties(page, pageSize, filters),
    staleTime: 5 * 60 * 1000, 
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
};
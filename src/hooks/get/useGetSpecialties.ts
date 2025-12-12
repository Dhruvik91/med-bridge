import { specialtyService } from '@/services/specialty.service';
import { useQuery } from '@tanstack/react-query';

export const useGetSpecialties = (page = 1, limit = 100) => {
  return useQuery({
    queryKey: ['specialties', page, limit],
    queryFn: () => specialtyService.findAll(page, limit),
  });
};

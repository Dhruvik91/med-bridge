import { specialtyService } from '@/services/specialty.service';
import { useQuery } from '@tanstack/react-query';

export const useGetSpecialties = () => {
  return useQuery({
    queryKey: ['specialties'],
    queryFn: () => specialtyService.findAll(),
  });
};

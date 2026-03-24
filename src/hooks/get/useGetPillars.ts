import { useQuery } from '@tanstack/react-query';
import { pillarService } from '@/services/pillar.service';

export const useGetPillars = () => {
  return useQuery({
    queryKey: ['pillars'],
    queryFn: () => pillarService.findAll(),
    staleTime: 5 * 60 * 1000,
  });
};

export const useGetPillar = (id: string) => {
  return useQuery({
    queryKey: ['pillar', id],
    queryFn: () => pillarService.findOne(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
};

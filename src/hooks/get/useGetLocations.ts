import { locationService } from '@/services/location.service';
import { useQuery } from '@tanstack/react-query';
import type { Location } from '@/types';

export const useGetLocations = () => {
  return useQuery<Location[]>({
    queryKey: ['locations'],
    queryFn: async () => {
      const paginated = await locationService.findAll();
      return paginated.items;
    },
  });
};

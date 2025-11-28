import { locationService } from '@/services/location.service';
import { useQuery } from '@tanstack/react-query';

export const useGetLocations = () => {
  return useQuery({
    queryKey: ['locations'],
    queryFn: () => locationService.findAll(),
  });
};

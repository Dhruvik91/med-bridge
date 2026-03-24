import { useQuery } from '@tanstack/react-query';
import { jobRoleService } from '@/services/job-role.service';

export const useGetJobRoles = () => {
  return useQuery({
    queryKey: ['jobRoles'],
    queryFn: () => jobRoleService.findAll(),
    staleTime: 5 * 60 * 1000,
  });
};

export const useGetJobRole = (id: string) => {
  return useQuery({
    queryKey: ['jobRole', id],
    queryFn: () => jobRoleService.findOne(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
};

export const useGetJobRolesByPillar = (pillarId: string) => {
  return useQuery({
    queryKey: ['jobRoles', 'pillar', pillarId],
    queryFn: () => jobRoleService.findByPillar(pillarId),
    enabled: !!pillarId,
    staleTime: 5 * 60 * 1000,
  });
};

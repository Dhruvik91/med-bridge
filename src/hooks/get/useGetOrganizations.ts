import { organizationService } from '@/services/organization.service';
import { useQuery } from '@tanstack/react-query';

export const useGetOrganizations = (employerProfileId: string | undefined) => {
  return useQuery({
    queryKey: ['organizations', employerProfileId],
    queryFn: () => {
      if (!employerProfileId) throw new Error('Employer profile not found');
      return organizationService.findByEmployer(employerProfileId);
    },
    enabled: !!employerProfileId,
  });
};

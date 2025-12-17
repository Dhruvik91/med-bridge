import { organizationService } from '@/services/organization.service';
import { useQuery } from '@tanstack/react-query';
import type { Organization } from '@/types';

export const useGetOrganizations = (
  employerProfileId: string | undefined,
  page = 1,
  limit = 50,
) => {
  return useQuery<Organization[]>({
    queryKey: ['organizations', employerProfileId, page, limit],
    queryFn: async () => {
      if (!employerProfileId) throw new Error('Employer profile not found');
      const paginated = await organizationService.findByEmployer(employerProfileId, page, limit);
      return paginated.items;
    },
    enabled: !!employerProfileId,
  });
};

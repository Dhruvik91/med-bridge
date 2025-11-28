import { employerProfileService } from "@/services/employer-profile.service";
import { useQuery } from "@tanstack/react-query";
import { User, UserRole } from "@/types";

export const useGetEmployerProfile = (user: User  | undefined) => {
  return useQuery({
    queryKey: ['employerProfile', user?.id],
    queryFn: () => {
      if (!user?.id) throw new Error('User not found');
      return employerProfileService.findByUser(user.id);
    },
    enabled: !!user?.id && user?.role === UserRole.employer,
  });   
}
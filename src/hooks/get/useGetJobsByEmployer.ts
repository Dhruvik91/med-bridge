import { jobService } from "@/services/job.service";
import { useQuery } from "@tanstack/react-query";

export const useGetJobsByEmployer = (employerProfileId: string) => {
    return useQuery({
        queryKey: ['employerJobs', employerProfileId],
        queryFn: () => jobService.findByEmployer(employerProfileId),
        enabled: !!employerProfileId,
    });
};

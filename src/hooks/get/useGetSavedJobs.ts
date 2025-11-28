import { savedJobService } from "@/services/saved-job.service";
import { useQuery } from "@tanstack/react-query";

export const useGetSavedJobs = (userId: string) => {
    return useQuery({
        queryKey: ['savedJobs', userId],
        queryFn: () => savedJobService.findByUser(userId),
        enabled: !!userId,
    });
};

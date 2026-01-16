import { savedJobService } from "@/services/saved-job.service";
import { useQuery } from "@tanstack/react-query";

export const useGetSavedJobs = (userId: string, page = 1, limit = 20) => {
    return useQuery({
        queryKey: ['savedJobs', userId, page, limit],
        queryFn: () => savedJobService.findByUser(userId, { page, limit }),
        enabled: !!userId,
        select: (data) => ({
            ...data,
            items: data.items.filter(item => item.job && !item.job.deletedAt)
        })
    });
};

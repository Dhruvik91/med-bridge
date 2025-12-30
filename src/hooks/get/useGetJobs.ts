import { jobService } from "@/services/job.service";
import { useQuery } from "@tanstack/react-query";

export const useGetJobs = (params: Record<string, any> = {}) => {
    return useQuery({
        queryKey: ['jobs', params],
        queryFn: () => jobService.findAll(params),
    });
};

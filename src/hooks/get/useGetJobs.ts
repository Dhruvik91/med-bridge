import { jobService } from "@/services/job.service";
import { useQuery } from "@tanstack/react-query";

export const useGetJobs = (page = 1, limit = 20) => {
    return useQuery({
        queryKey: ['jobs', page, limit],
        queryFn: () => jobService.findAll(page, limit),
    });
};

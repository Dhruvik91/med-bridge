import { jobService } from "@/services/job.service";
import { useQuery } from "@tanstack/react-query";

export const useGetJobs = () => {
    return useQuery({
        queryKey: ['jobs'],
        queryFn: jobService.findAll,
    });
};

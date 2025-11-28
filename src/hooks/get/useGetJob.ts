import { jobService } from "@/services/job.service";
import { useQuery } from "@tanstack/react-query";

export const useGetJob = (id: string) => {
    return useQuery({
        queryKey: ['job', id],
        queryFn: () => jobService.findOne(id),
        enabled: !!id,
    });
};

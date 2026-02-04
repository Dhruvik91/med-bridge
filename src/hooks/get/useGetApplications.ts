import { applicationService } from "@/services/application.service";
import { useQuery } from "@tanstack/react-query";

export const useGetApplications = (page = 1, limit = 20) => {
    return useQuery({
        queryKey: ['allApplications', page, limit],
        queryFn: () => applicationService.findAll(page, limit),
    });
};

export const useGetApplicationsByCandidate = (candidateId: string) => {
    return useQuery({
        queryKey: ['candidateApplications', candidateId],
        queryFn: () => applicationService.findByCandidate(candidateId),
        enabled: !!candidateId,
    });
};

export const useGetApplicationsByJob = (jobId: string) => {
    return useQuery({
        queryKey: ['jobApplications', jobId],
        queryFn: () => applicationService.findByJob(jobId),
        enabled: !!jobId,
    });
};

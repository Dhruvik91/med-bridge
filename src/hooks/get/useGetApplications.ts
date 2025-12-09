import { applicationService } from "@/services/application.service";
import { useQuery } from "@tanstack/react-query";

export const useGetApplications = () => {
    return useQuery({
        queryKey: ['allApplications'],
        queryFn: applicationService.findAll,
    });
};

export const useGetApplicationsByCandidate = (candidateId: string) => {
    return useQuery({
        queryKey: ['candidateApplications', candidateId],
        queryFn: () => applicationService.findByCandidate(candidateId),
        enabled: !!candidateId,
    });
};

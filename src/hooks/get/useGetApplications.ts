import { applicationService } from "@/services/application.service";
import { useQuery } from "@tanstack/react-query";

export const useGetApplications = () => {
    return useQuery({
        queryKey: ['allApplications'],
        queryFn: applicationService.findAll,
    });
};

export const useGetApplicationsByCandidate = (candidateProfileId: string) => {
    return useQuery({
        queryKey: ['candidateApplications', candidateProfileId],
        queryFn: () => applicationService.findByCandidate(candidateProfileId),
        enabled: !!candidateProfileId,
    });
};

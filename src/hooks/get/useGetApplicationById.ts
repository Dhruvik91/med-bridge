import { applicationService } from "@/services/application.service";
import { useQuery } from "@tanstack/react-query";

export const useGetApplicationById = (applicationId: string) => {
    return useQuery({
        queryKey: ['application', applicationId],
        queryFn: () => applicationService.findOne(applicationId),
        enabled: !!applicationId,
    });
};

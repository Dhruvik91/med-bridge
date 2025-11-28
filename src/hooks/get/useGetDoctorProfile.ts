import { doctorProfileService } from "@/services/doctor-profile.service";
import { useQuery } from "@tanstack/react-query";

export const useGetDoctorProfile = (userId: string) => {
    return useQuery({
        queryKey: ['doctorProfile', userId],
        queryFn: () => doctorProfileService.findByUser(userId),
        enabled: !!userId,
    });
};

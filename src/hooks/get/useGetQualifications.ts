import { qualificationService } from '@/services/qualification.service';
import { useQuery } from '@tanstack/react-query';

export const useGetQualifications = (page = 1, limit = 100) => {
    return useQuery({
        queryKey: ['qualifications', page, limit],
        queryFn: () => qualificationService.findAll(page, limit),
    });
};

import { authService } from "@/services/auth.service";
import { useQuery } from "@tanstack/react-query";

export const useGetMe = () => {
    return useQuery({
        queryKey: ['currentUser'],
        queryFn: authService.getMe,
      });
}
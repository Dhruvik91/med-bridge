import { useAuth } from "@/providers/auth-provider";
import { User } from "@/types";

export const useGetMe = () => {
    const { user, profile, loading } = useAuth();
    
    // Map UserProfile to User type to maintain compatibility
    const userData: User | undefined = profile ? {
        id: profile.id,
        email: profile.email,
        role: profile.role,
        isEmailVerified: profile.isVerified,
        isGoogleSignup: false, // This field isn't available in our backend, defaulting to false
        createdAt: profile.createdAt,
        updatedAt: profile.updatedAt,
    } : undefined;
    
    return {
        data: userData,
        isLoading: loading,
        error: null,
        isError: false,
        isSuccess: !loading && user !== null,
    };
}
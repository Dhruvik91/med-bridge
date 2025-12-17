'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { API_CONFIG, FRONTEND_ROUTES } from '@/constants/constants';
import httpService from '@/lib/http-service';
import { getDashboardRoute } from '@/lib/dashboard-routes';
import { UserRole } from '@/types';


type AuthUser = {
  id: string;
  email: string;
  role: UserRole;
  isActive: boolean;
  isVerified: boolean;
};

type UserProfile = {
  id: string;
  email: string;
  role: UserRole;
  isActive: boolean;
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  metadata: Record<string, any>;
};

type BackendUser = {
  id: string;
  email: string;
  role: UserRole;
  isActive: boolean;
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  metadata: Record<string, any>;
};

interface AuthContextType {
  user: AuthUser | null;
  profile: UserProfile | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, role: UserRole.candidate | UserRole.employer) => Promise<void>;
  signOut: () => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

type AuthResponse = {
  access_token: string;
  user: BackendUser;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function mapBackendUser(user: BackendUser): { authUser: AuthUser; profile: UserProfile; } {
  const authUser: AuthUser = {
    id: user.id,
    email: user.email,
    role: user.role,
    isActive: user.isActive,
    isVerified: user.isVerified,
  };

  const profile: UserProfile = {
    id: user.id,
    email: user.email,
    role: user.role,
    isActive: user.isActive,
    isVerified: user.isVerified,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
    deletedAt: user.deletedAt,
    metadata: user.metadata,
  };

  return { authUser, profile };
}

export function AuthProvider({ children }: { children: React.ReactNode; }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  const loadUser = async () => {
    try {
      const { data } = await httpService.get<BackendUser>(API_CONFIG.path.userAuth.me);
      const mapped = mapBackendUser(data);
      setUser(mapped.authUser);
      setProfile(mapped.profile);
      return mapped.authUser;
    } catch {
      setUser(null);
      setProfile(null);
      return null;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const init = async () => {
      if (typeof window === 'undefined') return;

      const url = new URL(window.location.href);
      const urlToken = url.searchParams.get('token');

      if (urlToken) {
        url.searchParams.delete('token');
        window.history.replaceState({}, '', url.toString());
        const userData = await loadUser();
        const dashboardRoute = getDashboardRoute(userData?.role || null);
        router.replace(dashboardRoute);
        return;
      }

      const publicRoutes = [FRONTEND_ROUTES.HOME, FRONTEND_ROUTES.AUTH.LOGIN, FRONTEND_ROUTES.AUTH.SIGNUP];

      const userData = await loadUser();

      if (!userData && !publicRoutes.includes(pathname)) {
        router.replace(FRONTEND_ROUTES.AUTH.LOGIN);
        return;
      }

      if (userData && publicRoutes.includes(pathname)) {
        const dashboardRoute = getDashboardRoute(userData.role);
        router.replace(dashboardRoute);
        return;
      }
    };

    void init();
  }, [router, pathname]);

  const signIn = async (email: string, password: string) => {
    try {
      const { data } = await httpService.post<AuthResponse>(API_CONFIG.path.userAuth.login, {
        email,
        password,
      });

      const mapped = mapBackendUser(data.user);
      setUser(mapped.authUser);
      setProfile(mapped.profile);

      // Redirect to appropriate dashboard after successful login
      const dashboardRoute = getDashboardRoute(mapped.authUser.role);
      router.push(dashboardRoute);
    } catch (err) {
      console.error('Login failed:', err);
      throw err;
    }
  };

  const signUp = async (email: string, password: string, role: UserRole.candidate | UserRole.employer) => {
    try {
      const { data } = await httpService.post<AuthResponse>(API_CONFIG.path.userAuth.signup, {
        email,
        password,
        role,
      });

      const mapped = mapBackendUser(data.user);
      setUser(mapped.authUser);
      setProfile(mapped.profile);

      // Redirect to profile completion after successful signup
      if (role === UserRole.candidate) {
        router.push(FRONTEND_ROUTES.PROFILE.DOCTOR.COMPLETE);
      } else {
        router.push(FRONTEND_ROUTES.PROFILE.EMPLOYER.COMPLETE);
      }
    } catch (err) {
      console.error('Signup failed:', err);
      throw err;
    } 
  };

  const signOut = async () => {
    try {
      await httpService.post(API_CONFIG.path.userAuth.logout);
    } finally {
      setUser(null);
      setProfile(null);
      router.push(FRONTEND_ROUTES.AUTH.LOGIN);
    }
  };

  const signInWithGoogle = async () => {
    if (typeof window === 'undefined') return;

    window.location.href = `${API_CONFIG.baseUrl}${API_CONFIG.path.userAuth.googleLogin}`;
  };

  const refreshUser = async () => {
    if (typeof window === 'undefined') return;
    await loadUser();
  };

  const value = {
    user,
    profile,
    loading,
    signIn,
    signUp,
    signOut,
    signInWithGoogle,
    refreshUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

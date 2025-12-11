'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { API_CONFIG, AUTH_TOKEN_KEY, FRONTEND_ROUTES } from '@/constants/constants';
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

interface AuthContextType
{
  user: AuthUser | null;
  profile: UserProfile | null;
  loading: boolean;
  signIn: ( email: string, password: string ) => Promise<void>;
  signUp: ( email: string, password: string, role: UserRole.candidate | UserRole.employer ) => Promise<void>;
  signOut: () => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

type AuthResponse = {
  access_token: string;
  user: BackendUser;
};

const AuthContext = createContext<AuthContextType | undefined>( undefined );

function mapBackendUser ( user: BackendUser ): { authUser: AuthUser; profile: UserProfile; }
{
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

export function AuthProvider ( { children }: { children: React.ReactNode; } )
{
  const [ user, setUser ] = useState<AuthUser | null>( null );
  const [ profile, setProfile ] = useState<UserProfile | null>( null );
  const [ loading, setLoading ] = useState( true );
  const router = useRouter();
  const pathname = usePathname();

  const loadUserFromToken = async ( token: string | null ) =>
  {
    if ( !token )
    {
      setUser( null );
      setProfile( null );
      setLoading( false );
      return null;
    }

    try
    {
      const { data } = await httpService.get<BackendUser>( API_CONFIG.path.userAuth.me );
      const mapped = mapBackendUser( data );
      setUser( mapped.authUser );
      setProfile( mapped.profile );
      return mapped.authUser;
    } catch
    {
      if ( typeof window !== 'undefined' )
      {
        window.localStorage.removeItem( AUTH_TOKEN_KEY );
      }
      setUser( null );
      setProfile( null );
      return null;
    } finally
    {
      setLoading( false );
    }
  };

  useEffect( () =>
  {
    const init = async () =>
    {
      if ( typeof window === 'undefined' ) return;

      const url = new URL( window.location.href );
      const urlToken = url.searchParams.get( 'token' );

      if ( urlToken )
      {
        window.localStorage.setItem( AUTH_TOKEN_KEY, urlToken );
        url.searchParams.delete( 'token' );
        window.history.replaceState( {}, '', url.toString() );
        const userData = await loadUserFromToken( urlToken );
        const dashboardRoute = getDashboardRoute( userData?.role || null );
        router.replace( dashboardRoute );
        return;
      }

      const storedToken = window.localStorage.getItem( AUTH_TOKEN_KEY );

      const publicRoutes = [ FRONTEND_ROUTES.HOME, FRONTEND_ROUTES.AUTH.LOGIN, FRONTEND_ROUTES.AUTH.SIGNUP ];

      if ( !storedToken && !publicRoutes.includes( pathname ) )
      {
        router.replace( FRONTEND_ROUTES.AUTH.LOGIN );
        setLoading( false );
        return;
      }

      if ( storedToken && publicRoutes.includes( pathname ) )
      {
        const userData = await loadUserFromToken( storedToken );
        const dashboardRoute = getDashboardRoute( userData?.role || null );
        router.replace( dashboardRoute );
        return;
      }

      await loadUserFromToken( storedToken );
    };

    void init();
  }, [ router, pathname ] );

  const signIn = async ( email: string, password: string ) =>
  {
    setLoading( true );
    try
    {
      const { data } = await httpService.post<AuthResponse>( API_CONFIG.path.userAuth.login, {
        email,
        password,
      } );

      if ( typeof window !== 'undefined' )
      {
        window.localStorage.setItem( AUTH_TOKEN_KEY, data.access_token );
      }

      const mapped = mapBackendUser( data.user );
      setUser( mapped.authUser );
      setProfile( mapped.profile );

      // Redirect to appropriate dashboard after successful login
      const dashboardRoute = getDashboardRoute( mapped.authUser.role );
      router.push( dashboardRoute );
    } finally
    {
      setLoading( false );
    }
  };

  const signUp = async ( email: string, password: string, role: UserRole.candidate | UserRole.employer ) =>
  {
    setLoading( true );
    try
    {
      const { data } = await httpService.post<AuthResponse>( API_CONFIG.path.userAuth.signup, {
        email,
        password,
        role,
      } );

      if ( typeof window !== 'undefined' )
      {
        window.localStorage.setItem( AUTH_TOKEN_KEY, data.access_token );
      }

      const mapped = mapBackendUser( data.user );
      setUser( mapped.authUser );
      setProfile( mapped.profile );

      // Redirect to profile completion after successful signup
      if ( role === UserRole.candidate )
      {
        router.push( FRONTEND_ROUTES.PROFILE.DOCTOR.COMPLETE );
      } else
      {
        router.push( FRONTEND_ROUTES.PROFILE.EMPLOYER.COMPLETE );
      }
    } finally
    {
      setLoading( false );
    }
  };

  const signOut = async () =>
  {
    router.push( FRONTEND_ROUTES.AUTH.LOGIN );
    if ( typeof window !== 'undefined' )
    {
      window.localStorage.removeItem( AUTH_TOKEN_KEY );
    }
    setUser( null );
    setProfile( null );
  };

  const signInWithGoogle = async () =>
  {
    if ( typeof window === 'undefined' ) return;

    window.location.href = `${ API_CONFIG.baseUrl }${ API_CONFIG.path.userAuth.googleLogin }`;
  };

  const refreshUser = async () =>
  {
    if ( typeof window === 'undefined' ) return;

    const storedToken = window.localStorage.getItem( AUTH_TOKEN_KEY );
    await loadUserFromToken( storedToken );
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

  return <AuthContext.Provider value={ value }>{ children }</AuthContext.Provider>;
}

export function useAuth ()
{
  const context = useContext( AuthContext );
  if ( context === undefined )
  {
    throw new Error( 'useAuth must be used within an AuthProvider' );
  }
  return context;
}

'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { API_CONFIG, AUTH_TOKEN_KEY } from '@/constants/constants';
import httpService from '@/lib/http-service';

type UserRole = 'doctor' | 'hospital' | 'admin';

type AuthUser = {
  id: string;
  email: string;
  role: UserRole;
  name: string | null;
};

type UserProfile = {
  id: string;
  email: string;
  role: UserRole;
  name: string | null;
  createdAt: string;
  profileId: string | null;
  isVerified: boolean;
};

type BackendUser = {
  id: string;
  email: string;
  role: UserRole;
  name: string | null;
  createdAt: string;
  profileId: string | null;
  isVerified: boolean;
};

interface AuthContextType
{
  user: AuthUser | null;
  profile: UserProfile | null;
  loading: boolean;
  signIn: ( email: string, password: string ) => Promise<void>;
  signUp: ( email: string, password: string, role: 'doctor' | 'hospital' ) => Promise<void>;
  signOut: () => Promise<void>;
  signInWithGoogle: () => Promise<void>;
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
    name: user.name,
  };

  const profile: UserProfile = {
    id: user.id,
    email: user.email,
    role: user.role,
    name: user.name,
    createdAt: user.createdAt,
    profileId: user.profileId,
    isVerified: user.isVerified,
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
      return;
    }

    try
    {
      const { data } = await httpService.get<BackendUser>( API_CONFIG.path.userAuth.me );
      const mapped = mapBackendUser( data );
      setUser( mapped.authUser );
      setProfile( mapped.profile );
    } catch
    {
      if ( typeof window !== 'undefined' )
      {
        window.localStorage.removeItem( AUTH_TOKEN_KEY );
      }
      setUser( null );
      setProfile( null );
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
        await loadUserFromToken( urlToken );
        router.replace( '/dashboard' );
        return;
      }

      const storedToken = window.localStorage.getItem( AUTH_TOKEN_KEY );

      const publicRoutes = [ '/auth/signin', '/auth/signup' ];
      if ( !storedToken && !publicRoutes.includes( pathname ) )
      {
        router.replace( '/auth/signin' );
        setLoading( false );
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
    } finally
    {
      setLoading( false );
    }
  };

  const signUp = async ( email: string, password: string, role: 'doctor' | 'hospital' ) =>
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
    } finally
    {
      setLoading( false );
    }
  };

  const signOut = async () =>
  {
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

    window.location.href = API_CONFIG.path.userAuth.googleLogin;
  };

  const value = {
    user,
    profile,
    loading,
    signIn,
    signUp,
    signOut,
    signInWithGoogle,
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

'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { api } from '@/lib/api-client'

type UserRole = 'doctor' | 'hospital' | 'admin'

type AuthUser = {
  id: string
  email: string
  role: UserRole
  name: string | null
}

type UserProfile = {
  id: string
  email: string
  role: UserRole
  name: string | null
  createdAt: string
  profileId: string | null
  isVerified: boolean
}

type BackendUser = {
  id: string
  email: string
  role: UserRole
  name: string | null
  createdAt: string
  profileId: string | null
  isVerified: boolean
}

interface AuthContextType {
  user: AuthUser | null
  profile: UserProfile | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string, role: 'doctor' | 'hospital') => Promise<void>
  signOut: () => Promise<void>
  signInWithGoogle: () => Promise<void>
}

type AuthResponse = {
  access_token: string
  user: BackendUser
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

const AUTH_TOKEN_KEY = 'auth_token'

function mapBackendUser(user: BackendUser): { authUser: AuthUser; profile: UserProfile } {
  const authUser: AuthUser = {
    id: user.id,
    email: user.email,
    role: user.role,
    name: user.name,
  }

  const profile: UserProfile = {
    id: user.id,
    email: user.email,
    role: user.role,
    name: user.name,
    createdAt: user.createdAt,
    profileId: user.profileId,
    isVerified: user.isVerified,
  }

  return { authUser, profile }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  const loadUserFromToken = async (token: string | null) => {
    if (!token) {
      setUser(null)
      setProfile(null)
      setLoading(false)
      return
    }

    try {
      const { data } = await api.get<BackendUser>('/user-auth/me')
      const mapped = mapBackendUser(data)
      setUser(mapped.authUser)
      setProfile(mapped.profile)
    } catch {
      if (typeof window !== 'undefined') {
        window.localStorage.removeItem(AUTH_TOKEN_KEY)
      }
      setUser(null)
      setProfile(null)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const init = async () => {
      if (typeof window === 'undefined') return

      const url = new URL(window.location.href)
      const urlToken = url.searchParams.get('token')

      if (urlToken) {
        window.localStorage.setItem(AUTH_TOKEN_KEY, urlToken)
        url.searchParams.delete('token')
        window.history.replaceState({}, '', url.toString())
        await loadUserFromToken(urlToken)
        router.replace('/dashboard')
        return
      }

      const storedToken = window.localStorage.getItem(AUTH_TOKEN_KEY)
      await loadUserFromToken(storedToken)
    }

    void init()
  }, [router])

  const signIn = async (email: string, password: string) => {
    setLoading(true)
    try {
      const { data } = await api.post<AuthResponse>('/user-auth/login', {
        email,
        password,
      })

      if (typeof window !== 'undefined') {
        window.localStorage.setItem(AUTH_TOKEN_KEY, data.access_token)
      }

      const mapped = mapBackendUser(data.user)
      setUser(mapped.authUser)
      setProfile(mapped.profile)
    } finally {
      setLoading(false)
    }
  }

  const signUp = async (email: string, password: string, role: 'doctor' | 'hospital') => {
    setLoading(true)
    try {
      const { data } = await api.post<AuthResponse>('/user-auth/signup', {
        email,
        password,
        role,
      })

      if (typeof window !== 'undefined') {
        window.localStorage.setItem(AUTH_TOKEN_KEY, data.access_token)
      }

      const mapped = mapBackendUser(data.user)
      setUser(mapped.authUser)
      setProfile(mapped.profile)
    } finally {
      setLoading(false)
    }
  }

  const signOut = async () => {
    if (typeof window !== 'undefined') {
      window.localStorage.removeItem(AUTH_TOKEN_KEY)
    }
    setUser(null)
    setProfile(null)
  }

  const signInWithGoogle = async () => {
    if (typeof window === 'undefined') return

    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000'
    window.location.href = `${baseUrl}/user-auth/google`
  }

  const value = {
    user,
    profile,
    loading,
    signIn,
    signUp,
    signOut,
    signInWithGoogle,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

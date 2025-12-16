import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { FRONTEND_ROUTES } from '@/constants/constants';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000';

const PUBLIC_PATHS = new Set<string>([
  FRONTEND_ROUTES.HOME,
  FRONTEND_ROUTES.AUTH.LOGIN,
  FRONTEND_ROUTES.AUTH.SIGNUP,
  FRONTEND_ROUTES.AUTH.CALLBACK,
]);

const DASHBOARD_ROUTES: Record<string, string> = {
  candidate: FRONTEND_ROUTES.DASHBOARD.CANDIDATE,
  doctor: FRONTEND_ROUTES.DASHBOARD.CANDIDATE,
  employer: FRONTEND_ROUTES.DASHBOARD.EMPLOYER,
};

interface ApiEnvelope<T> {
  statusCode: number;
  data: T | null;
  isError: boolean;
  message?: string | string[];
  error?: string;
}

interface BackendUser {
  id: string;
  email: string;
  role: 'candidate' | 'employer' | 'doctor';
  isActive: boolean;
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  metadata: Record<string, any>;
}

async function fetchCurrentUser(req: NextRequest): Promise<BackendUser | null> {
  try {
    const res = await fetch(`${API_BASE_URL}/user-auth/me`, {
      headers: {
        cookie: req.headers.get('cookie') ?? '',
      },
    });

    if (!res.ok) return null;

    const envelope = (await res.json()) as ApiEnvelope<BackendUser>;
    if (!envelope || envelope.isError || !envelope.data) return null;

    return envelope.data;
  } catch {
    return null;
  }
}

async function hasCompletedProfile(req: NextRequest, user: BackendUser): Promise<boolean> {
  try {
    if (user.role === 'candidate' || user.role === 'doctor') {
      const res = await fetch(`${API_BASE_URL}/doctor-profiles/user`, {
        headers: {
          cookie: req.headers.get('cookie') ?? '',
        },
      });
      if (!res.ok) return false;
      const envelope = (await res.json()) as ApiEnvelope<unknown>;
      return !envelope.isError && !!envelope.data;
    }

    if (user.role === 'employer') {
      const res = await fetch(`${API_BASE_URL}/employer-profiles/user`, {
        headers: {
          cookie: req.headers.get('cookie') ?? '',
        },
      });
      if (!res.ok) return false;
      const envelope = (await res.json()) as ApiEnvelope<unknown>;
      return !envelope.isError && !!envelope.data;
    }

    return false;
  } catch {
    return false;
  }
}

function getDashboardRoute(role: BackendUser['role'] | null | undefined): string {
  if (!role) return FRONTEND_ROUTES.DASHBOARD.CANDIDATE;
  return DASHBOARD_ROUTES[role] ?? FRONTEND_ROUTES.DASHBOARD.CANDIDATE;
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const isPublic = PUBLIC_PATHS.has(pathname);
  const isAppRoute =
    pathname.startsWith(FRONTEND_ROUTES.DASHBOARD.BASE) ||
    pathname.startsWith(FRONTEND_ROUTES.JOBS.BASE) ||
    pathname.startsWith(FRONTEND_ROUTES.APPLICATIONS.BASE) ||
    pathname.startsWith(FRONTEND_ROUTES.SAVED_JOBS) ||
    pathname.startsWith(FRONTEND_ROUTES.PROFILE.BASE);

  // Only do work for routes we care about
  if (!isPublic && !isAppRoute) {
    return NextResponse.next();
  }

  const user = await fetchCurrentUser(req);

  // Unauthenticated users
  if (!user) {
    if (isAppRoute) {
      const url = req.nextUrl.clone();
      url.pathname = FRONTEND_ROUTES.AUTH.LOGIN;
      url.searchParams.set('next', pathname);
      return NextResponse.redirect(url);
    }

    // Public routes stay public
    return NextResponse.next();
  }

  // Authenticated users on public auth routes -> redirect to dashboard
  if (isPublic && (pathname === FRONTEND_ROUTES.HOME || pathname.startsWith('/auth'))) {
    const url = req.nextUrl.clone();
    url.pathname = getDashboardRoute(user.role);
    url.searchParams.delete('next');
    return NextResponse.redirect(url);
  }

  // Enforce role-based access and profile completion for app routes
  if (isAppRoute) {
    const hasProfile = await hasCompletedProfile(req, user);

    // If no profile, restrict access to app routes except profile completion
    if (!hasProfile) {
      const isDoctorCompletion = pathname.startsWith(FRONTEND_ROUTES.PROFILE.DOCTOR.COMPLETE);
      const isEmployerCompletion = pathname.startsWith(FRONTEND_ROUTES.PROFILE.EMPLOYER.COMPLETE);

      if (!isDoctorCompletion && !isEmployerCompletion) {
        const url = req.nextUrl.clone();
        if (user.role === 'employer') {
          url.pathname = FRONTEND_ROUTES.PROFILE.EMPLOYER.COMPLETE;
        } else {
          url.pathname = FRONTEND_ROUTES.PROFILE.DOCTOR.COMPLETE;
        }
        url.searchParams.set('next', pathname);
        return NextResponse.redirect(url);
      }
    }

    // Basic role-based dashboard access guard (extra safety)
    if (
      pathname.startsWith(FRONTEND_ROUTES.DASHBOARD.CANDIDATE) &&
      !(user.role === 'candidate' || user.role === 'doctor')
    ) {
      const url = req.nextUrl.clone();
      url.pathname = getDashboardRoute(user.role);
      return NextResponse.redirect(url);
    }

    if (pathname.startsWith(FRONTEND_ROUTES.DASHBOARD.EMPLOYER) && user.role !== 'employer') {
      const url = req.nextUrl.clone();
      url.pathname = getDashboardRoute(user.role);
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    FRONTEND_ROUTES.HOME,
    '/auth/:path*',
    `${FRONTEND_ROUTES.DASHBOARD.BASE}/:path*`,
    `${FRONTEND_ROUTES.JOBS.BASE}/:path*`,
    `${FRONTEND_ROUTES.APPLICATIONS.BASE}/:path*`,
    `${FRONTEND_ROUTES.SAVED_JOBS}/:path*`,
    `${FRONTEND_ROUTES.PROFILE.BASE}/:path*`,
  ],
};

export const API_CONFIG = {
  baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000",
  path: {
    userAuth: {
      login: "/user-auth/login",
      signup: "/user-auth/signup",
      googleLogin: "/user-auth/google",
      me: "/user-auth/me",
    },
  },
};

export const FRONTEND_ROUTES = {
  HOME: '/',
  JOBS: '/jobs',
  APPLICATIONS: '/applications',
  SAVED_JOBS: '/saved-jobs',
  AUTH: {
    LOGIN: '/auth/login',
    SIGNUP: '/auth/signup',
    CALLBACK: '/auth/callback',
  },
  DASHBOARD: {
    BASE: '/dashboard',
    CANDIDATE: '/dashboard/candidate',
    EMPLOYER: '/dashboard/employer',
    DOCTOR: '/dashboard/doctor',
  },
  PROFILE: {
    BASE: '/profile',
    DOCTOR: {
      COMPLETE: '/profile/doctor/complete',
      EDIT: '/profile/doctor/edit',
    },
    EMPLOYER: {
      COMPLETE: '/profile/employer/complete',
      EDIT: '/profile/employer/edit',
    },
  },
}

export const AUTH_TOKEN_KEY = 'auth_token'


export enum ROLES {
  CANDIDATE = 'candidate',
  EMPLOYER = 'employer',
  DOCTOR = 'doctor',
}
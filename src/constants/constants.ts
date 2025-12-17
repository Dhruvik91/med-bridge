export const API_CONFIG = {
  baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000",
  path: {
    userAuth: {
      login: "/user-auth/login",
      signup: "/user-auth/signup",
      googleLogin: "/user-auth/google",
      me: "/user-auth/me",
      logout: "/user-auth/logout",
      forgotPassword: "/user-auth/forgot-password",
      resetPassword: "/user-auth/reset-password",
    },
    applications: {
      base: "/applications",
      jobApplications: "/applications/job",
      candidateApplications: "/applications/candidate",
    },
    doctorProfiles: {
      base: "/doctor-profiles",
      byUser: "/doctor-profiles/user",
    },
    employerProfiles: {
      base: "/employer-profiles",
      byUser: "/employer-profiles/user",
    },
    jobNotes: {
      base: "/job-notes",
      byJob: "/job-notes/job",
      byApplication: "/job-notes/application",
    },
    jobs: {
      base: "/jobs",
      byEmployer: "/jobs/employer",
      byOrganization: "/jobs/organization",
      byLocation: "/jobs/location",
    },
    organizations: {
      base: "/organizations",
      byEmployer: "/organizations/employer",
    },
    savedJobs: {
      base: "/saved-jobs",
      byUser: "/saved-jobs/user",
    },
    specialties: {
      base: "/specialties",
      bySlug: "/specialties/slug",
    },
    users: "/users",
    attachments: "/attachments",
    jobSeekerProfiles: "/job-seeker-profiles",
    locations: "/locations",
    uploads: "/uploads",
  },
};

export const FRONTEND_ROUTES = {
  HOME: '/',
  JOBS: {
    BASE: '/jobs',
    CREATE: '/jobs/create',
    MANAGE: '/jobs/manage',
    DETAIL: '/jobs/[id]',
  },
  APPLICATIONS: {
    BASE: '/applications',
    MANAGE: '/applications/manage',
  },
  SAVED_JOBS: '/saved-jobs',
  AUTH: {
    LOGIN: '/auth/login',
    SIGNUP: '/auth/signup',
    CALLBACK: '/auth/callback',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: '/auth/reset-password',
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
      BASE: '/profile/doctor',
      COMPLETE: '/profile/doctor/complete',
      EDIT: '/profile/doctor/edit',
    },
    EMPLOYER: {
      BASE: '/profile/employer',
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
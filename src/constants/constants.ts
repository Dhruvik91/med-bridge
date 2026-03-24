export const API_CONFIG = {
  baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000",
  path: {
    userAuth: {
      login: "/user-auth/login",
      signup: "/user-auth/register",
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
      base: "/doctor-profile",
      byUser: "/doctor-profile/user",
    },
    employerProfiles: {
      base: "/employer-profile",
      byUser: "/employer-profile/user",
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
    qualifications: {
      base: "/qualifications",
      bySlug: "/qualifications/slug",
    },
    users: "/users",
    attachments: "/attachments",
    jobSeekerProfiles: "/job-seeker-profiles",
    locations: "/locations",
    uploads: "/uploads",
    admin: {
      base: "/admin",
      stats: "/admin/stats",
      users: "/admin/users",
      candidates: "/admin/candidates",
      employers: "/admin/employers",
      jobs: "/admin/jobs",
      applications: "/admin/applications",
    },
    pillars: {
      base: "/pillars",
    },
    jobRoles: {
      base: "/job-roles",
      byPillar: "/job-roles/pillar",
    },
    candidateProfiles: {
      base: "/candidate-profiles",
      byUser: "/candidate-profiles/user",
    },
    candidateRoles: {
      base: "/candidate-roles",
      byCandidate: "/candidate-roles/candidate",
    },
    candidatePreferences: {
      base: "/candidate-preferences",
      byCandidate: "/candidate-preferences/candidate",
    },
    clinicalProfiles: {
      base: "/clinical-profiles",
      byCandidateRole: "/clinical-profiles/candidate-role",
    },
    financeProfiles: {
      base: "/finance-profiles",
      byCandidateRole: "/finance-profiles/candidate-role",
    },
    hrProfiles: {
      base: "/hr-profiles",
      byCandidateRole: "/hr-profiles/candidate-role",
    },
    itProfiles: {
      base: "/it-profiles",
      byCandidateRole: "/it-profiles/candidate-role",
    },
    legalProfiles: {
      base: "/legal-profiles",
      byCandidateRole: "/legal-profiles/candidate-role",
    },
    marketingProfiles: {
      base: "/marketing-profiles",
      byCandidateRole: "/marketing-profiles/candidate-role",
    },
    operationsProfiles: {
      base: "/operations-profiles",
      byCandidateRole: "/operations-profiles/candidate-role",
    },
    qualityProfiles: {
      base: "/quality-profiles",
      byCandidateRole: "/quality-profiles/candidate-role",
    },
    supplyChainProfiles: {
      base: "/supply-chain-profiles",
      byCandidateRole: "/supply-chain-profiles/candidate-role",
    },
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
    TRACK: '/applications/track',
  },
  SAVED_JOBS: '/saved-jobs',
  FEED: '/feed',
  ONBOARDING: {
    CANDIDATE: '/onboarding/candidate',
    EMPLOYER: '/onboarding/employer',
  },
  EMPLOYER: {
    APPLICATIONS: '/employer/applications',
  },
  AUTH: {
    LOGIN: '/auth/login',
    SIGNUP: '/auth/signup',
    CALLBACK: '/auth/callback',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: '/auth/reset-password',
    EMPLOYER: '/auth/employer/signup',
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
  ADMIN: {
    BASE: '/dashboard/admin',
    USERS: '/dashboard/admin/users',
    CANDIDATES: '/dashboard/admin/candidates',
    EMPLOYERS: '/dashboard/admin/employers',
    JOBS: '/dashboard/admin/jobs',
    APPLICATIONS: '/dashboard/admin/applications',
  },
}

export const AUTH_TOKEN_KEY = 'auth_token'


export enum ROLES {
  CANDIDATE = 'candidate',
  EMPLOYER = 'employer',
  ADMIN = 'admin',
}


export const COMPANY_EMAIL = process.env.NEXT_PUBLIC_COMPANY_EMAIL || "dhruvikgondaliya91@gmail.com"
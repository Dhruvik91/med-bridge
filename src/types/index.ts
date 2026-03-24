// Enums
export enum UserRole {
  candidate = 'candidate',
  employer = 'employer',
  admin = 'admin',
}

export enum JobType {
  full_time = 'full_time',
  part_time = 'part_time',
  contract = 'contract',
  temporary = 'temporary',
  internship = 'internship',
}

export enum JobStatus {
  draft = 'draft',
  published = 'published',
  closed = 'closed',
  archived = 'archived',
}

export enum ApplicationStatus {
  applied = 'applied',
  viewed = 'viewed',
  shortlisted = 'shortlisted',
  interview = 'interview',
  offer = 'offer',
  hired = 'hired',
  rejected = 'rejected',
  withdrawn = 'withdrawn',
}

export enum Gender {
  male = 'male',
  female = 'female',
  other = 'other',
  prefer_not_say = 'prefer_not_say',
}

// Entities
export interface User {
  id: string;
  email: string;
  role: UserRole;
  isEmailVerified: boolean;
  isGoogleSignup: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface DoctorProfile {
  id: string;
  userId: string;
  fullName: string;
  displayName?: string | null;
  dob?: string | null;
  gender?: Gender | null;
  phone?: string | null;
  summary?: string | null;
  experienceYears?: number | null;
  qualifications: string[];
  specialties: string[];
  licenseNumbers: string[];
  country?: string | null;
  city?: string | null;
  address?: string | null;
  avatarUrl?: string | null;
  resumeUrl?: string | null;
  socialLinks: Record<string, any>;
  createdAt: string;
  updatedAt: string;
  user?: User;
}

export interface EmployerProfile {
  id: string;
  userId: string;
  name: string;
  contactPerson?: string | null;
  phone?: string | null;
  email?: string | null;
  website?: string | null;
  description?: string | null;
  address?: string | null;
  city?: string | null;
  state?: string | null;
  country?: string | null;
  postalCode?: string | null;
  logoUrl?: string | null;
  createdAt: string;
  updatedAt: string;
  user?: User;
  organizations?: Organization[];
}

export interface Specialty {
  id: string;
  name: string;
  slug: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Qualification {
  id: string;
  name: string;
  slug: string;
  createdAt: string;
  updatedAt: string;
}

export interface Organization {
  id: string;
  employerProfileId: string;
  name: string;
  slug?: string | null;
  description?: string;
  website?: string;
  logoUrl?: string;
  address?: string | null;
  city?: string | null;
  state?: string | null;
  country?: string | null;
  phone?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  createdAt: string;
  updatedAt: string;
  employerProfile?: EmployerProfile;
}

export interface Location {
  id: string;
  name: string;
  address?: string;
  city: string;
  state?: string;
  country: string;
  postalCode?: string;
  latitude?: number;
  longitude?: number;
  createdAt: string;
  updatedAt: string;
}

export interface Job {
  id: string;
  employerProfileId: string;
  organizationId?: string;
  locationId?: string;
  title: string;
  slug?: string | null;
  description: string;
  requirements?: string | string[];
  responsibilities?: string[];
  perks?: string[];
  benefits?: string;
  salaryMin?: string | number;
  salaryMax?: string | number;
  currency?: string;
  jobType: JobType;
  status: JobStatus;
  postedByUserId?: string | null;
  publishedAt?: string | null;
  applicationDeadline?: string | null;
  maxApplications?: number | null;
  experienceMin?: number | null;
  experienceMax?: number | null;
  postedDate?: string;
  closingDate?: string;
  viewCount?: number;
  viewsCount?: string | number;
  favoritesCount?: string | number;
  searchVector?: any;
  metadata?: Record<string, any>;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
  employerProfile?: EmployerProfile;
  organization?: Organization;
  location?: Location;
  specialties?: Specialty[];
  postedBy?: User | null;
  applications?: Application[];
}

export interface Application {
  id: string;
  jobId: string;
  candidateId: string;
  status: ApplicationStatus;
  coverLetter?: string;
  resumeUrl?: string;
  appliedAt: string;
  updatedAt: string;
  isArchived: boolean;
  job?: Job;
  candidate?: User;
  candidateProfile?: DoctorProfile;
  expectedSalary?: string | null;
}

export interface SavedJob {
  id: string;
  userId: string;
  jobId: string;
  savedAt: string;
  user?: User;
  job?: Job;
}

export interface JobNote {
  id: string;
  jobId?: string;
  applicationId?: string;
  authorId: string;
  noteText: string;
  createdAt: string;
  updatedAt: string;
  job?: Job;
  application?: Application;
  author?: User;
}

export interface Attachment {
  id: string;
  ownerType: string;
  ownerId: string;
  fileUrl: string;
  fileName: string;
  fileSize?: number;
  mimeType?: string;
  uploadedAt: string;
}

// DTOs
export interface SignupDto {
  email: string;
  password: string;
  userType: UserRole;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface AuthResponse {
  access_token: string;
  user: User;
}

export interface CreateUserDto {
  email: string;
  password: string;
  role: UserRole;
}

export interface UpdateUserDto {
  email?: string;
  role?: UserRole;
  isEmailVerified?: boolean;
}

export interface CreateDoctorProfileDto {
  userId: string;
  fullName: string;
  displayName?: string;
  dob?: string;
  gender?: Gender;
  phone?: string;
  summary?: string;
  experienceYears?: number;
  qualifications?: string[];
  specialties?: string[];
  licenseNumbers?: string[];
  country?: string;
  city?: string;
  address?: string;
  avatarUrl?: string;
  resumeUrl?: string;
  socialLinks?: Record<string, any>;
}

export interface UpdateDoctorProfileDto extends Partial<CreateDoctorProfileDto> { }

export interface CreateEmployerProfileDto {
  userId: string;
  name: string;
  contactPerson?: string;
  phone?: string;
  email?: string;
  website?: string;
  description?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  postalCode?: string;
  logoUrl?: string;
}

export interface UpdateEmployerProfileDto extends Partial<CreateEmployerProfileDto> { }

export interface CreateJobDto {
  employerProfileId: string;
  organizationId?: string;
  locationId?: string;
  title: string;
  description: string;
  requirements?: string[];
  perks?: string[];
  salaryMin?: string;
  salaryMax?: string;
  jobType: JobType;
  status?: JobStatus;
  applicationDeadline?: string;
  maxApplications?: number;
  experienceMin?: number;
  experienceMax?: number;
  specialtyIds?: string[];
  responsibilities?: string[];
}

export interface UpdateJobDto extends Partial<CreateJobDto> { }

export interface CreateApplicationDto {
  jobId: string;
  candidateId: string;
  coverLetter?: string;
  resumeUrl?: string;
}

export interface UpdateApplicationDto {
  status?: ApplicationStatus;
  coverLetter?: string;
}

export interface CreateSavedJobDto {
  userId: string;
  jobId: string;
}

export interface CreateJobNoteDto {
  jobId?: string;
  applicationId?: string;
  authorId: string;
  noteText: string;
}

export interface UpdateJobNoteDto {
  noteText?: string;
}

export interface CreateSpecialtyDto {
  name: string;
  description?: string;
}

export interface UpdateSpecialtyDto extends Partial<CreateSpecialtyDto> { }

export interface CreateQualificationDto {
  name: string;
}

export interface UpdateQualificationDto extends Partial<CreateQualificationDto> { }

export interface CreateOrganizationDto {
  employerProfileId: string;
  name: string;
  description?: string;
  website?: string;
  logoUrl?: string;
}

export interface UpdateOrganizationDto extends Partial<CreateOrganizationDto> { }

export interface CreateLocationDto {
  name: string;
  address?: string;
  city: string;
  state?: string;
  country: string;
  postalCode?: string;
  latitude?: number;
  longitude?: number;
}

export interface UpdateLocationDto extends Partial<CreateLocationDto> { }

export interface CreateAttachmentDto {
  ownerType: string;
  ownerId: string;
  fileUrl: string;
  fileName: string;
  fileSize?: number;
  mimeType?: string;
}

// New Entities for Enhanced System

export interface Pillar {
  id: string;
  name: string;
  slug: string;
  description?: string;
  metadata?: Record<string, any>;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
  jobRoles?: JobRole[];
}

export interface JobRole {
  id: string;
  pillarId: string;
  name: string;
  slug: string;
  description?: string;
  metadata?: Record<string, any>;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
  pillar?: Pillar;
}

export interface CandidateProfile {
  id: string;
  userId: string;
  firstName: string;
  lastName: string;
  phone?: string | null;
  dateOfBirth?: string | null;
  gender?: Gender | null;
  bio?: string | null;
  currentLocationId?: string | null;
  yearsOfExperience?: number | null;
  preferredWorkType?: string | null;
  avatarUrl?: string | null;
  resumeUrl?: string | null;
  metadata?: Record<string, any>;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
  user?: User;
  currentLocation?: Location;
  candidateRoles?: CandidateRole[];
}

export interface CandidateRole {
  id: string;
  candidateId: string;
  jobRoleId: string;
  isPrimary: boolean;
  metadata?: Record<string, any>;
  createdAt: string;
  updatedAt: string;
  candidate?: CandidateProfile;
  jobRole?: JobRole;
  clinicalProfile?: ClinicalProfile;
  financeProfile?: FinanceProfile;
  hrProfile?: HRProfile;
  itProfile?: ITProfile;
  legalProfile?: LegalProfile;
  marketingProfile?: MarketingProfile;
  operationsProfile?: OperationsProfile;
  qualityProfile?: QualityProfile;
  supplyChainProfile?: SupplyChainProfile;
}

export interface CandidatePreference {
  id: string;
  candidateId: string;
  preferredLocations?: string[];
  preferredRoles?: string[];
  expectedSalaryMin?: string | null;
  expectedSalaryMax?: string | null;
  preferredJobTypes?: string[];
  willingToRelocate?: boolean;
  metadata?: Record<string, any>;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
}

// Department-Specific Profiles

export interface ClinicalProfile {
  id: string;
  candidateRoleId: string;
  licenseNumber?: string | null;
  registrationCouncil?: string | null;
  experienceYears?: number | null;
  consultationType?: string[];
  shiftPreference?: string | null;
  availableDays?: string[];
  metadata?: Record<string, any>;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
  candidateRole?: CandidateRole;
}

export interface FinanceProfile {
  id: string;
  candidateRoleId: string;
  certifications?: string[];
  accountingTools?: string[];
  experienceYears?: number | null;
  metadata?: Record<string, any>;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
  candidateRole?: CandidateRole;
}

export interface HRProfile {
  id: string;
  candidateRoleId: string;
  toolsUsed?: string[];
  hiringExperienceYears?: number | null;
  industriesHandled?: string[];
  metadata?: Record<string, any>;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
  candidateRole?: CandidateRole;
}

export interface ITProfile {
  id: string;
  candidateRoleId: string;
  techStack?: string[];
  certifications?: string[];
  experienceYears?: number | null;
  metadata?: Record<string, any>;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
  candidateRole?: CandidateRole;
}

export interface LegalProfile {
  id: string;
  candidateRoleId: string;
  complianceExperience?: string | null;
  certifications?: string[];
  experienceYears?: number | null;
  metadata?: Record<string, any>;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
  candidateRole?: CandidateRole;
}

export interface MarketingProfile {
  id: string;
  candidateRoleId: string;
  channels?: string[];
  campaignExperience?: string | null;
  experienceYears?: number | null;
  metadata?: Record<string, any>;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
  candidateRole?: CandidateRole;
}

export interface OperationsProfile {
  id: string;
  candidateRoleId: string;
  hospitalSizeHandled?: string | null;
  processExpertise?: string[];
  experienceYears?: number | null;
  metadata?: Record<string, any>;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
  candidateRole?: CandidateRole;
}

export interface QualityProfile {
  id: string;
  candidateRoleId: string;
  accreditationExperience?: string[];
  auditExperienceYears?: number | null;
  metadata?: Record<string, any>;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
  candidateRole?: CandidateRole;
}

export interface SupplyChainProfile {
  id: string;
  candidateRoleId: string;
  inventorySystems?: string[];
  vendorManagementExperience?: number | null;
  metadata?: Record<string, any>;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
  candidateRole?: CandidateRole;
}

// DTOs for New Entities

export interface CreatePillarDto {
  name: string;
  description?: string;
}

export interface UpdatePillarDto extends Partial<CreatePillarDto> {}

export interface CreateJobRoleDto {
  pillarId: string;
  name: string;
  description?: string;
}

export interface UpdateJobRoleDto extends Partial<CreateJobRoleDto> {}

export interface CreateCandidateProfileDto {
  userId: string;
  firstName: string;
  lastName: string;
  phone?: string;
  dateOfBirth?: string;
  gender?: Gender;
  bio?: string;
  currentLocationId?: string;
  yearsOfExperience?: number;
  preferredWorkType?: string;
  avatarUrl?: string;
  resumeUrl?: string;
}

export interface UpdateCandidateProfileDto extends Partial<CreateCandidateProfileDto> {}

export interface CreateCandidateRoleDto {
  candidateId: string;
  jobRoleId: string;
  isPrimary?: boolean;
}

export interface UpdateCandidateRoleDto extends Partial<CreateCandidateRoleDto> {}

export interface CreateCandidatePreferenceDto {
  candidateId: string;
  preferredLocations?: string[];
  preferredRoles?: string[];
  expectedSalaryMin?: string;
  expectedSalaryMax?: string;
  preferredJobTypes?: string[];
  willingToRelocate?: boolean;
}

export interface UpdateCandidatePreferenceDto extends Partial<CreateCandidatePreferenceDto> {}

export interface CreateClinicalProfileDto {
  candidateRoleId: string;
  licenseNumber?: string;
  registrationCouncil?: string;
  experienceYears?: number;
  consultationType?: string[];
  shiftPreference?: string;
  availableDays?: string[];
}

export interface UpdateClinicalProfileDto extends Partial<CreateClinicalProfileDto> {}

export interface CreateFinanceProfileDto {
  candidateRoleId: string;
  certifications?: string[];
  accountingTools?: string[];
  experienceYears?: number;
}

export interface UpdateFinanceProfileDto extends Partial<CreateFinanceProfileDto> {}

export interface CreateHRProfileDto {
  candidateRoleId: string;
  toolsUsed?: string[];
  hiringExperienceYears?: number;
  industriesHandled?: string[];
}

export interface UpdateHRProfileDto extends Partial<CreateHRProfileDto> {}

export interface CreateITProfileDto {
  candidateRoleId: string;
  techStack?: string[];
  certifications?: string[];
  experienceYears?: number;
}

export interface UpdateITProfileDto extends Partial<CreateITProfileDto> {}

export interface CreateLegalProfileDto {
  candidateRoleId: string;
  complianceExperience?: string;
  certifications?: string[];
  experienceYears?: number;
}

export interface UpdateLegalProfileDto extends Partial<CreateLegalProfileDto> {}

export interface CreateMarketingProfileDto {
  candidateRoleId: string;
  channels?: string[];
  campaignExperience?: string;
  experienceYears?: number;
}

export interface UpdateMarketingProfileDto extends Partial<CreateMarketingProfileDto> {}

export interface CreateOperationsProfileDto {
  candidateRoleId: string;
  hospitalSizeHandled?: string;
  processExpertise?: string[];
  experienceYears?: number;
}

export interface UpdateOperationsProfileDto extends Partial<CreateOperationsProfileDto> {}

export interface CreateQualityProfileDto {
  candidateRoleId: string;
  accreditationExperience?: string[];
  auditExperienceYears?: number;
}

export interface UpdateQualityProfileDto extends Partial<CreateQualityProfileDto> {}

export interface CreateSupplyChainProfileDto {
  candidateRoleId: string;
  inventorySystems?: string[];
  vendorManagementExperience?: number;
}

export interface UpdateSupplyChainProfileDto extends Partial<CreateSupplyChainProfileDto> {}

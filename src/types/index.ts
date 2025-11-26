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
  remote = 'remote',
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
  firstName?: string;
  lastName?: string;
  phone?: string;
  dateOfBirth?: string;
  gender?: Gender;
  bio?: string;
  licenseNumber?: string;
  yearsOfExperience?: number;
  profilePictureUrl?: string;
  resumeUrl?: string;
  linkedInUrl?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  postalCode?: string;
  isProfileComplete: boolean;
  createdAt: string;
  updatedAt: string;
  user?: User;
  specialties?: Specialty[];
}

export interface EmployerProfile {
  id: string;
  userId: string;
  companyName?: string;
  contactPersonName?: string;
  phone?: string;
  companyLogoUrl?: string;
  companyWebsite?: string;
  companyDescription?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  postalCode?: string;
  isVerified: boolean;
  isProfileComplete: boolean;
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

export interface Organization {
  id: string;
  employerProfileId: string;
  name: string;
  description?: string;
  website?: string;
  logoUrl?: string;
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
  description: string;
  requirements?: string;
  benefits?: string;
  salaryMin?: number;
  salaryMax?: number;
  jobType: JobType;
  status: JobStatus;
  postedDate: string;
  closingDate?: string;
  viewCount: number;
  createdAt: string;
  updatedAt: string;
  employerProfile?: EmployerProfile;
  organization?: Organization;
  location?: Location;
  specialties?: Specialty[];
}

export interface Application {
  id: string;
  jobId: string;
  candidateId: string;
  status: ApplicationStatus;
  coverLetter?: string;
  appliedAt: string;
  updatedAt: string;
  isArchived: boolean;
  job?: Job;
  candidate?: DoctorProfile;
}

export interface SavedJob {
  id: string;
  userId: string;
  jobId: string;
  savedAt: string;
  user?: User;
  job?: Job;
}

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  subject?: string;
  body: string;
  isRead: boolean;
  sentAt: string;
  sender?: User;
  receiver?: User;
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
  role: UserRole;
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
  firstName?: string;
  lastName?: string;
  phone?: string;
  dateOfBirth?: string;
  gender?: Gender;
  bio?: string;
  licenseNumber?: string;
  yearsOfExperience?: number;
  profilePictureUrl?: string;
  resumeUrl?: string;
  linkedInUrl?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  postalCode?: string;
  specialtyIds?: string[];
}

export interface UpdateDoctorProfileDto extends Partial<CreateDoctorProfileDto> {}

export interface CreateEmployerProfileDto {
  userId: string;
  companyName?: string;
  contactPersonName?: string;
  phone?: string;
  companyLogoUrl?: string;
  companyWebsite?: string;
  companyDescription?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  postalCode?: string;
}

export interface UpdateEmployerProfileDto extends Partial<CreateEmployerProfileDto> {}

export interface CreateJobDto {
  employerProfileId: string;
  organizationId?: string;
  locationId?: string;
  title: string;
  description: string;
  requirements?: string;
  benefits?: string;
  salaryMin?: number;
  salaryMax?: number;
  jobType: JobType;
  status?: JobStatus;
  closingDate?: string;
  specialtyIds?: string[];
}

export interface UpdateJobDto extends Partial<CreateJobDto> {}

export interface CreateApplicationDto {
  jobId: string;
  candidateId: string;
  coverLetter?: string;
}

export interface UpdateApplicationDto {
  status?: ApplicationStatus;
  coverLetter?: string;
}

export interface CreateSavedJobDto {
  userId: string;
  jobId: string;
}

export interface CreateMessageDto {
  senderId: string;
  receiverId: string;
  subject?: string;
  body: string;
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

export interface UpdateSpecialtyDto extends Partial<CreateSpecialtyDto> {}

export interface CreateOrganizationDto {
  employerProfileId: string;
  name: string;
  description?: string;
  website?: string;
  logoUrl?: string;
}

export interface UpdateOrganizationDto extends Partial<CreateOrganizationDto> {}

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

export interface UpdateLocationDto extends Partial<CreateLocationDto> {}

export interface CreateAttachmentDto {
  ownerType: string;
  ownerId: string;
  fileUrl: string;
  fileName: string;
  fileSize?: number;
  mimeType?: string;
}

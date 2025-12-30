import httpService from '@/lib/http-service';
import { User, DoctorProfile, EmployerProfile, Job, Application } from '@/types';
import { Paginated } from '@/constants/interface';

export interface AdminStats {
  totalUsers: number;
  totalCandidates: number;
  totalEmployers: number;
  totalJobs: number;
  totalApplications: number;
  activeJobs: number;
  publishedJobs: number;
}

export interface AdminUsersQuery {
  page?: number;
  limit?: number;
  q?: string;
  role?: string;
  isActive?: boolean;
  isVerified?: boolean;
}

export interface AdminJobsQuery {
  page?: number;
  limit?: number;
  q?: string;
  status?: string;
  employerProfileId?: string;
}

export interface AdminApplicationsQuery {
  page?: number;
  limit?: number;
  q?: string;
  status?: string;
  jobId?: string;
  candidateId?: string;
}

export interface UpdateUserAdminDto {
  role?: string;
  isActive?: boolean;
  isVerified?: boolean;
}

const BASE_PATH = '/admin';

export const adminService = {
  async getStats(): Promise<AdminStats> {
    const response = await httpService.get<AdminStats>(`${BASE_PATH}/stats`);
    return response.data;
  },

  async findAllUsers(params: AdminUsersQuery = {}): Promise<Paginated<User>> {
    const response = await httpService.get<Paginated<User>>(`${BASE_PATH}/users`, {
      params,
    });
    return response.data;
  },

  async findUserById(id: string): Promise<User> {
    const response = await httpService.get<User>(`${BASE_PATH}/users/${id}`);
    return response.data;
  },

  async updateUser(id: string, data: UpdateUserAdminDto): Promise<User> {
    const response = await httpService.patch<User>(`${BASE_PATH}/users/${id}`, data);
    return response.data;
  },

  async deleteUser(id: string): Promise<void> {
    await httpService.delete(`${BASE_PATH}/users/${id}`);
  },

  async findAllCandidates(params: AdminUsersQuery = {}): Promise<Paginated<DoctorProfile>> {
    const response = await httpService.get<Paginated<DoctorProfile>>(`${BASE_PATH}/candidates`, {
      params,
    });
    return response.data;
  },

  async findCandidateById(id: string): Promise<DoctorProfile> {
    const response = await httpService.get<DoctorProfile>(`${BASE_PATH}/candidates/${id}`);
    return response.data;
  },

  async deleteCandidate(id: string): Promise<void> {
    await httpService.delete(`${BASE_PATH}/candidates/${id}`);
  },

  async findAllEmployers(params: AdminUsersQuery = {}): Promise<Paginated<EmployerProfile>> {
    const response = await httpService.get<Paginated<EmployerProfile>>(`${BASE_PATH}/employers`, {
      params,
    });
    return response.data;
  },

  async findEmployerById(id: string): Promise<EmployerProfile> {
    const response = await httpService.get<EmployerProfile>(`${BASE_PATH}/employers/${id}`);
    return response.data;
  },

  async deleteEmployer(id: string): Promise<void> {
    await httpService.delete(`${BASE_PATH}/employers/${id}`);
  },

  async findAllJobs(params: AdminJobsQuery = {}): Promise<Paginated<Job>> {
    const response = await httpService.get<Paginated<Job>>(`${BASE_PATH}/jobs`, {
      params,
    });
    return response.data;
  },

  async findJobById(id: string): Promise<Job> {
    const response = await httpService.get<Job>(`${BASE_PATH}/jobs/${id}`);
    return response.data;
  },

  async deleteJob(id: string): Promise<void> {
    await httpService.delete(`${BASE_PATH}/jobs/${id}`);
  },

  async findAllApplications(params: AdminApplicationsQuery = {}): Promise<Paginated<Application>> {
    const response = await httpService.get<Paginated<Application>>(`${BASE_PATH}/applications`, {
      params,
    });
    return response.data;
  },

  async findApplicationById(id: string): Promise<Application> {
    const response = await httpService.get<Application>(`${BASE_PATH}/applications/${id}`);
    return response.data;
  },

  async deleteApplication(id: string): Promise<void> {
    await httpService.delete(`${BASE_PATH}/applications/${id}`);
  },
};

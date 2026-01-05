import httpService from '@/lib/http-service';
import { User, DoctorProfile, EmployerProfile, Job, Application } from '@/types';
import { Paginated } from '@/constants/interface';
import { API_CONFIG } from '@/constants/constants';

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

export const adminService = {
  async getStats(): Promise<AdminStats> {
    const response = await httpService.get<AdminStats>(API_CONFIG.path.admin.stats);
    return response.data;
  },

  async findAllUsers(params: AdminUsersQuery = {}): Promise<Paginated<User>> {
    const response = await httpService.get<Paginated<User>>(API_CONFIG.path.admin.users, {
      params,
    });
    return response.data;
  },

  async findUserById(id: string): Promise<User> {
    const response = await httpService.get<User>(`${API_CONFIG.path.admin.users}/${id}`);
    return response.data;
  },

  async updateUser(id: string, data: UpdateUserAdminDto): Promise<User> {
    const response = await httpService.patch<User>(`${API_CONFIG.path.admin.users}/${id}`, data);
    return response.data;
  },

  async deleteUser(id: string): Promise<void> {
    await httpService.delete(`${API_CONFIG.path.admin.users}/${id}`);
  },

  async findAllCandidates(params: AdminUsersQuery = {}): Promise<Paginated<DoctorProfile>> {
    const response = await httpService.get<Paginated<DoctorProfile>>(API_CONFIG.path.admin.candidates, {
      params,
    });
    return response.data;
  },

  async findCandidateById(id: string): Promise<DoctorProfile> {
    const response = await httpService.get<DoctorProfile>(`${API_CONFIG.path.admin.candidates}/${id}`);
    return response.data;
  },

  async deleteCandidate(id: string): Promise<void> {
    await httpService.delete(`${API_CONFIG.path.admin.candidates}/${id}`);
  },

  async findAllEmployers(params: AdminUsersQuery = {}): Promise<Paginated<EmployerProfile>> {
    const response = await httpService.get<Paginated<EmployerProfile>>(API_CONFIG.path.admin.employers, {
      params,
    });
    return response.data;
  },

  async findEmployerById(id: string): Promise<EmployerProfile> {
    const response = await httpService.get<EmployerProfile>(`${API_CONFIG.path.admin.employers}/${id}`);
    return response.data;
  },

  async deleteEmployer(id: string): Promise<void> {
    await httpService.delete(`${API_CONFIG.path.admin.employers}/${id}`);
  },

  async findAllJobs(params: AdminJobsQuery = {}): Promise<Paginated<Job>> {
    const response = await httpService.get<Paginated<Job>>(API_CONFIG.path.admin.jobs, {
      params,
    });
    return response.data;
  },

  async findJobById(id: string): Promise<Job> {
    const response = await httpService.get<Job>(`${API_CONFIG.path.admin.jobs}/${id}`);
    return response.data;
  },

  async deleteJob(id: string): Promise<void> {
    await httpService.delete(`${API_CONFIG.path.admin.jobs}/${id}`);
  },

  async findAllApplications(params: AdminApplicationsQuery = {}): Promise<Paginated<Application>> {
    const response = await httpService.get<Paginated<Application>>(API_CONFIG.path.admin.applications, {
      params,
    });
    return response.data;
  },

  async findApplicationById(id: string): Promise<Application> {
    const response = await httpService.get<Application>(`${API_CONFIG.path.admin.applications}/${id}`);
    return response.data;
  },

  async deleteApplication(id: string): Promise<void> {
    await httpService.delete(`${API_CONFIG.path.admin.applications}/${id}`);
  },
};

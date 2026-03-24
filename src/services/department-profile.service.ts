import httpService from '@/lib/http-service';
import {
  ClinicalProfile,
  FinanceProfile,
  HRProfile,
  ITProfile,
  LegalProfile,
  MarketingProfile,
  OperationsProfile,
  QualityProfile,
  SupplyChainProfile,
  CreateClinicalProfileDto,
  CreateFinanceProfileDto,
  CreateHRProfileDto,
  CreateITProfileDto,
  CreateLegalProfileDto,
  CreateMarketingProfileDto,
  CreateOperationsProfileDto,
  CreateQualityProfileDto,
  CreateSupplyChainProfileDto,
  UpdateClinicalProfileDto,
  UpdateFinanceProfileDto,
  UpdateHRProfileDto,
  UpdateITProfileDto,
  UpdateLegalProfileDto,
  UpdateMarketingProfileDto,
  UpdateOperationsProfileDto,
  UpdateQualityProfileDto,
  UpdateSupplyChainProfileDto,
} from '@/types';
import { API_CONFIG } from '@/constants/constants';

export const clinicalProfileService = {
  async findByCandidateRole(candidateRoleId: string): Promise<ClinicalProfile> {
    const response = await httpService.get<ClinicalProfile>(`${API_CONFIG.path.clinicalProfiles.byCandidateRole}/${candidateRoleId}`);
    return response.data;
  },

  async create(data: CreateClinicalProfileDto): Promise<ClinicalProfile> {
    const response = await httpService.post<ClinicalProfile>(API_CONFIG.path.clinicalProfiles.base, data);
    return response.data;
  },

  async update(id: string, data: UpdateClinicalProfileDto): Promise<ClinicalProfile> {
    const response = await httpService.patch<ClinicalProfile>(`${API_CONFIG.path.clinicalProfiles.base}/${id}`, data);
    return response.data;
  },

  async remove(id: string): Promise<void> {
    await httpService.delete(`${API_CONFIG.path.clinicalProfiles.base}/${id}`);
  },
};

export const financeProfileService = {
  async findByCandidateRole(candidateRoleId: string): Promise<FinanceProfile> {
    const response = await httpService.get<FinanceProfile>(`${API_CONFIG.path.financeProfiles.byCandidateRole}/${candidateRoleId}`);
    return response.data;
  },

  async create(data: CreateFinanceProfileDto): Promise<FinanceProfile> {
    const response = await httpService.post<FinanceProfile>(API_CONFIG.path.financeProfiles.base, data);
    return response.data;
  },

  async update(id: string, data: UpdateFinanceProfileDto): Promise<FinanceProfile> {
    const response = await httpService.patch<FinanceProfile>(`${API_CONFIG.path.financeProfiles.base}/${id}`, data);
    return response.data;
  },

  async remove(id: string): Promise<void> {
    await httpService.delete(`${API_CONFIG.path.financeProfiles.base}/${id}`);
  },
};

export const hrProfileService = {
  async findByCandidateRole(candidateRoleId: string): Promise<HRProfile> {
    const response = await httpService.get<HRProfile>(`${API_CONFIG.path.hrProfiles.byCandidateRole}/${candidateRoleId}`);
    return response.data;
  },

  async create(data: CreateHRProfileDto): Promise<HRProfile> {
    const response = await httpService.post<HRProfile>(API_CONFIG.path.hrProfiles.base, data);
    return response.data;
  },

  async update(id: string, data: UpdateHRProfileDto): Promise<HRProfile> {
    const response = await httpService.patch<HRProfile>(`${API_CONFIG.path.hrProfiles.base}/${id}`, data);
    return response.data;
  },

  async remove(id: string): Promise<void> {
    await httpService.delete(`${API_CONFIG.path.hrProfiles.base}/${id}`);
  },
};

export const itProfileService = {
  async findByCandidateRole(candidateRoleId: string): Promise<ITProfile> {
    const response = await httpService.get<ITProfile>(`${API_CONFIG.path.itProfiles.byCandidateRole}/${candidateRoleId}`);
    return response.data;
  },

  async create(data: CreateITProfileDto): Promise<ITProfile> {
    const response = await httpService.post<ITProfile>(API_CONFIG.path.itProfiles.base, data);
    return response.data;
  },

  async update(id: string, data: UpdateITProfileDto): Promise<ITProfile> {
    const response = await httpService.patch<ITProfile>(`${API_CONFIG.path.itProfiles.base}/${id}`, data);
    return response.data;
  },

  async remove(id: string): Promise<void> {
    await httpService.delete(`${API_CONFIG.path.itProfiles.base}/${id}`);
  },
};

export const legalProfileService = {
  async findByCandidateRole(candidateRoleId: string): Promise<LegalProfile> {
    const response = await httpService.get<LegalProfile>(`${API_CONFIG.path.legalProfiles.byCandidateRole}/${candidateRoleId}`);
    return response.data;
  },

  async create(data: CreateLegalProfileDto): Promise<LegalProfile> {
    const response = await httpService.post<LegalProfile>(API_CONFIG.path.legalProfiles.base, data);
    return response.data;
  },

  async update(id: string, data: UpdateLegalProfileDto): Promise<LegalProfile> {
    const response = await httpService.patch<LegalProfile>(`${API_CONFIG.path.legalProfiles.base}/${id}`, data);
    return response.data;
  },

  async remove(id: string): Promise<void> {
    await httpService.delete(`${API_CONFIG.path.legalProfiles.base}/${id}`);
  },
};

export const marketingProfileService = {
  async findByCandidateRole(candidateRoleId: string): Promise<MarketingProfile> {
    const response = await httpService.get<MarketingProfile>(`${API_CONFIG.path.marketingProfiles.byCandidateRole}/${candidateRoleId}`);
    return response.data;
  },

  async create(data: CreateMarketingProfileDto): Promise<MarketingProfile> {
    const response = await httpService.post<MarketingProfile>(API_CONFIG.path.marketingProfiles.base, data);
    return response.data;
  },

  async update(id: string, data: UpdateMarketingProfileDto): Promise<MarketingProfile> {
    const response = await httpService.patch<MarketingProfile>(`${API_CONFIG.path.marketingProfiles.base}/${id}`, data);
    return response.data;
  },

  async remove(id: string): Promise<void> {
    await httpService.delete(`${API_CONFIG.path.marketingProfiles.base}/${id}`);
  },
};

export const operationsProfileService = {
  async findByCandidateRole(candidateRoleId: string): Promise<OperationsProfile> {
    const response = await httpService.get<OperationsProfile>(`${API_CONFIG.path.operationsProfiles.byCandidateRole}/${candidateRoleId}`);
    return response.data;
  },

  async create(data: CreateOperationsProfileDto): Promise<OperationsProfile> {
    const response = await httpService.post<OperationsProfile>(API_CONFIG.path.operationsProfiles.base, data);
    return response.data;
  },

  async update(id: string, data: UpdateOperationsProfileDto): Promise<OperationsProfile> {
    const response = await httpService.patch<OperationsProfile>(`${API_CONFIG.path.operationsProfiles.base}/${id}`, data);
    return response.data;
  },

  async remove(id: string): Promise<void> {
    await httpService.delete(`${API_CONFIG.path.operationsProfiles.base}/${id}`);
  },
};

export const qualityProfileService = {
  async findByCandidateRole(candidateRoleId: string): Promise<QualityProfile> {
    const response = await httpService.get<QualityProfile>(`${API_CONFIG.path.qualityProfiles.byCandidateRole}/${candidateRoleId}`);
    return response.data;
  },

  async create(data: CreateQualityProfileDto): Promise<QualityProfile> {
    const response = await httpService.post<QualityProfile>(API_CONFIG.path.qualityProfiles.base, data);
    return response.data;
  },

  async update(id: string, data: UpdateQualityProfileDto): Promise<QualityProfile> {
    const response = await httpService.patch<QualityProfile>(`${API_CONFIG.path.qualityProfiles.base}/${id}`, data);
    return response.data;
  },

  async remove(id: string): Promise<void> {
    await httpService.delete(`${API_CONFIG.path.qualityProfiles.base}/${id}`);
  },
};

export const supplyChainProfileService = {
  async findByCandidateRole(candidateRoleId: string): Promise<SupplyChainProfile> {
    const response = await httpService.get<SupplyChainProfile>(`${API_CONFIG.path.supplyChainProfiles.byCandidateRole}/${candidateRoleId}`);
    return response.data;
  },

  async create(data: CreateSupplyChainProfileDto): Promise<SupplyChainProfile> {
    const response = await httpService.post<SupplyChainProfile>(API_CONFIG.path.supplyChainProfiles.base, data);
    return response.data;
  },

  async update(id: string, data: UpdateSupplyChainProfileDto): Promise<SupplyChainProfile> {
    const response = await httpService.patch<SupplyChainProfile>(`${API_CONFIG.path.supplyChainProfiles.base}/${id}`, data);
    return response.data;
  },

  async remove(id: string): Promise<void> {
    await httpService.delete(`${API_CONFIG.path.supplyChainProfiles.base}/${id}`);
  },
};

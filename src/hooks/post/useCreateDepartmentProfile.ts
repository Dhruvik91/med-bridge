import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  clinicalProfileService,
  financeProfileService,
  hrProfileService,
  itProfileService,
  legalProfileService,
  marketingProfileService,
  operationsProfileService,
  qualityProfileService,
  supplyChainProfileService,
} from '@/services/department-profile.service';
import {
  CreateClinicalProfileDto,
  CreateFinanceProfileDto,
  CreateHRProfileDto,
  CreateITProfileDto,
  CreateLegalProfileDto,
  CreateMarketingProfileDto,
  CreateOperationsProfileDto,
  CreateQualityProfileDto,
  CreateSupplyChainProfileDto,
} from '@/types';
import { toast } from 'sonner';

export const useCreateClinicalProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateClinicalProfileDto) => clinicalProfileService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clinicalProfile'] });
      toast.success('Clinical profile created successfully');
    },
    onError: (error: any) => {
      toast.error(error?.message || 'Failed to create clinical profile');
    },
  });
};

export const useCreateFinanceProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateFinanceProfileDto) => financeProfileService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['financeProfile'] });
      toast.success('Finance profile created successfully');
    },
    onError: (error: any) => {
      toast.error(error?.message || 'Failed to create finance profile');
    },
  });
};

export const useCreateHRProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateHRProfileDto) => hrProfileService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['hrProfile'] });
      toast.success('HR profile created successfully');
    },
    onError: (error: any) => {
      toast.error(error?.message || 'Failed to create HR profile');
    },
  });
};

export const useCreateITProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateITProfileDto) => itProfileService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['itProfile'] });
      toast.success('IT profile created successfully');
    },
    onError: (error: any) => {
      toast.error(error?.message || 'Failed to create IT profile');
    },
  });
};

export const useCreateLegalProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateLegalProfileDto) => legalProfileService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['legalProfile'] });
      toast.success('Legal profile created successfully');
    },
    onError: (error: any) => {
      toast.error(error?.message || 'Failed to create legal profile');
    },
  });
};

export const useCreateMarketingProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateMarketingProfileDto) => marketingProfileService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['marketingProfile'] });
      toast.success('Marketing profile created successfully');
    },
    onError: (error: any) => {
      toast.error(error?.message || 'Failed to create marketing profile');
    },
  });
};

export const useCreateOperationsProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateOperationsProfileDto) => operationsProfileService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['operationsProfile'] });
      toast.success('Operations profile created successfully');
    },
    onError: (error: any) => {
      toast.error(error?.message || 'Failed to create operations profile');
    },
  });
};

export const useCreateQualityProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateQualityProfileDto) => qualityProfileService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['qualityProfile'] });
      toast.success('Quality profile created successfully');
    },
    onError: (error: any) => {
      toast.error(error?.message || 'Failed to create quality profile');
    },
  });
};

export const useCreateSupplyChainProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateSupplyChainProfileDto) => supplyChainProfileService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['supplyChainProfile'] });
      toast.success('Supply chain profile created successfully');
    },
    onError: (error: any) => {
      toast.error(error?.message || 'Failed to create supply chain profile');
    },
  });
};

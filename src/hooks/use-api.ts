'use client'

import { useQuery, useMutation, type UseQueryOptions, type UseMutationOptions, type QueryKey } from '@tanstack/react-query'
import type { AxiosError, AxiosRequestConfig } from 'axios'

import { api } from '@/lib/api-client'

export type ApiError = AxiosError<{
  data: unknown
  message: string[]
  error: string
  statusCode: number
  isError: boolean
}>

export function useGet<TData = unknown>(
  queryKey: QueryKey,
  url: string,
  config?: AxiosRequestConfig,
  options?: Omit<UseQueryOptions<TData, ApiError>, 'queryKey' | 'queryFn'>
) {
  return useQuery<TData, ApiError>({
    queryKey,
    queryFn: async () => {
      const response = await api.get<TData>(url, config)
      return response.data
    },
    ...options,
  })
}

export function usePost<TData = unknown, TVariables = unknown>(
  url: string,
  options?: UseMutationOptions<TData, ApiError, TVariables>
) {
  return useMutation<TData, ApiError, TVariables>({
    mutationFn: async (variables) => {
      const response = await api.post<TData>(url, variables)
      return response.data
    },
    ...options,
  })
}

export function usePut<TData = unknown, TVariables = unknown>(
  url: string,
  options?: UseMutationOptions<TData, ApiError, TVariables>
) {
  return useMutation<TData, ApiError, TVariables>({
    mutationFn: async (variables) => {
      const response = await api.put<TData>(url, variables)
      return response.data
    },
    ...options,
  })
}

export function useDelete<TData = unknown, TVariables = unknown>(
  url: string,
  options?: UseMutationOptions<TData, ApiError, TVariables>
) {
  return useMutation<TData, ApiError, TVariables>({
    mutationFn: async (variables) => {
      const response = await api.delete<TData>(url, { data: variables })
      return response.data
    },
    ...options,
  })
}

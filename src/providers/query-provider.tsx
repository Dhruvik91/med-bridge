'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { useState } from 'react'

export function QueryProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 1000 * 60 * 5,     // 5 min – data considered fresh
            gcTime: 1000 * 60 * 30,       // 30 min – unused data removed
            retry: 2,                     // retry failed query 2 times
            refetchOnWindowFocus: false,  // avoid sudden refetch when switching tabs
            refetchOnReconnect: true,
            refetchOnMount: false,
          },
          mutations: {
            retry: 1,                     // retry one time only for mutations
          },
        },
      })
  )

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  )
}

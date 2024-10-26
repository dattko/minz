'use client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactNode, useState } from 'react'

export default function QueryProvider({ children }: { children: ReactNode }) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 1000 * 60 * 2,     // 2분
        refetchInterval: 1000 * 60 * 3,// 3분
        refetchOnWindowFocus: true,    // 윈도우 포커스시 갱신
        retry: 1,                      // 실패시 1번 재시도
        refetchOnReconnect: true,      // 재연결시 갱신
        refetchOnMount: true,          // 컴포넌트 마운트시 갱신
      },
    },
  }))

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  )
}
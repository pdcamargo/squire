import NiceModal from '@ebay/nice-modal-react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

import { Toaster } from '@/components/ui/sonner'

const queryClient = new QueryClient()

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <NiceModal.Provider>
        <main data-id="root-layout" className="w-full h-screen overflow-hidden">
          {children}
        </main>

        <Toaster />
      </NiceModal.Provider>
    </QueryClientProvider>
  )
}

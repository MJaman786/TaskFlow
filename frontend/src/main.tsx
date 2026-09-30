import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from 'react-hot-toast'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <Toaster
        position="bottom-right"
        toastOptions={{
          duration: 3500,
          style: {
            background: 'var(--surface-card, #ffffff)',
            color: 'var(--ink, #171717)',
            border: '1px solid var(--hairline-strong, #dcdee0)',
            borderRadius: '10px',
            fontSize: '13px',
            fontFamily: 'Inter, sans-serif',
            boxShadow: '0 4px 16px rgba(0, 0, 0, 0.08)',
            padding: '10px 14px',
          },
          success: {
            iconTheme: {
              primary: '#16a34a',
              secondary: '#ffffff',
            },
          },
          error: {
            iconTheme: {
              primary: '#eb8e90',
              secondary: '#171717',
            },
          },
        }}
      />
      <App />
    </QueryClientProvider>
  </StrictMode>,
)

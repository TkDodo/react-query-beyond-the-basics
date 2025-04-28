import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider, createRouter } from '@tanstack/react-router'

// Import the generated route tree
import { routeTree } from './routeTree.gen'

import './styles.css'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { bookQueries } from '@/api/openlibrary'

const queryClient = new QueryClient()

queryClient.setQueryDefaults(bookQueries.all(), { staleTime: 2 * 60 * 1000 })

// Create a new router instance
const router = createRouter({
  routeTree,
  context: {
    queryClient,
  },
  defaultPreload: 'intent',
  scrollRestoration: true,
  defaultStructuralSharing: true,
  defaultPreloadStaleTime: 0,
  defaultGcTime: 0,
  defaultPendingMinMs: 0,
  defaultPendingMs: 100,
})

// Register the router instance for type safety
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

// Render the app
const rootElement = document.querySelector('#app')
if (rootElement && !rootElement.innerHTML) {
  const root = createRoot(rootElement)
  // await (await import('@/server/handlers')).worker.start()
  root.render(
    <StrictMode>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>
    </StrictMode>,
  )
}

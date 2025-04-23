import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider, createRouter } from '@tanstack/react-router'
import { get, set, del } from 'idb-keyval'

// Import the generated route tree
import { routeTree } from './routeTree.gen'

import './styles.css'
import {
  defaultShouldDehydrateQuery,
  QueryClient,
  useIsRestoring,
} from '@tanstack/react-query'
import { createAsyncStoragePersister } from '@tanstack/query-async-storage-persister'
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client'
import { ErrorState } from '@/books/search-states'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      gcTime: 1000 * 60 * 60, // 1 hour
      experimental_prefetchInRender: true,
    },
  },
})

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
  defaultPendingMs: 0,
  defaultErrorComponent: ErrorState,
})

// Register the router instance for type safety
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

declare module '@tanstack/react-query' {
  interface Register {
    queryMeta: {
      persist?: boolean
    }
  }
}

const persister = createAsyncStoragePersister({
  storage: {
    getItem: get,
    setItem: set,
    removeItem: del,
  },
})

function PersistGate({ children }: { children: React.ReactNode }) {
  const isRestoring = useIsRestoring()

  return isRestoring ? null : children
}

// Render the app
const rootElement = document.querySelector('#app')
if (rootElement && !rootElement.innerHTML) {
  const root = createRoot(rootElement)
  // await (await import('@/server/handlers')).worker.start()
  root.render(
    <StrictMode>
      <PersistQueryClientProvider
        persistOptions={{
          persister,
          dehydrateOptions: {
            shouldDehydrateQuery: (query) =>
              defaultShouldDehydrateQuery(query) &&
              query.meta?.persist === true,
          },
        }}
        client={queryClient}
      >
        <PersistGate>
          <RouterProvider router={router} />
        </PersistGate>
      </PersistQueryClientProvider>
    </StrictMode>,
  )
}

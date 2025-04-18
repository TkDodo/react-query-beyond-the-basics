import {
  Outlet,
  createRootRouteWithContext,
  retainSearchParams,
} from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'
import { QueryClient } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { type } from 'arktype'

interface RouterContext {
  queryClient: QueryClient
}

const schema = type({
  page: 'number = 1',
  filter: 'string = ""',
})

export const Route = createRootRouteWithContext<RouterContext>()({
  validateSearch: schema,
  search: {
    middlewares: [retainSearchParams(['filter', 'page'])],
  },
  component: () => (
    <>
      <Outlet />
      <TanStackRouterDevtools />
      <ReactQueryDevtools />
    </>
  ),
})

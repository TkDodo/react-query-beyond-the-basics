import {
  Outlet,
  createRootRouteWithContext,
  retainSearchParams,
  stripSearchParams,
} from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'
import { QueryClient } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { type } from 'arktype'

interface RouterContext {
  queryClient: QueryClient
}

const defaultValues = {
  page: 1,
  filter: '',
} as const

const schema = type({
  page: `number = ${defaultValues.page}`,
  filter: `string = "${defaultValues.filter}"`,
})

export const Route = createRootRouteWithContext<RouterContext>()({
  validateSearch: schema,
  search: {
    middlewares: [
      stripSearchParams(defaultValues),
      retainSearchParams(['page', 'filter']),
    ],
  },
  component: () => (
    <>
      <Outlet />
      <TanStackRouterDevtools />
      <ReactQueryDevtools />
    </>
  ),
})

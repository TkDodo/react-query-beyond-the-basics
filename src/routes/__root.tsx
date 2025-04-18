import { Outlet, createRootRouteWithContext } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'
import { QueryClient } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { type } from 'arktype'

interface RouterContext {
  queryClient: QueryClient
}

const arkSchema = type({
  page: 'number > 0 = 1',
  filter: 'string = ""',
})

// const zodSchema = z.object({
//   page: z.number().gt(0).default(1),
//   filter: z.string().default(''),
// })

export const Route = createRootRouteWithContext<RouterContext>()({
  validateSearch: arkSchema,
  component: () => (
    <>
      <Outlet />
      <TanStackRouterDevtools />
      <ReactQueryDevtools />
    </>
  ),
})

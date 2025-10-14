import {
  Outlet,
  createRootRouteWithContext,
  useMatch,
} from '@tanstack/react-router'
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'
import { QueryClient } from '@tanstack/react-query'
import { ReactQueryDevtoolsPanel } from '@tanstack/react-query-devtools'
import { TanStackDevtools } from '@tanstack/react-devtools'
import { type } from 'arktype'
import { Header } from '@/books/header'
import { SearchForm } from '@/books/search-form'

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
  component: function Root() {
    const filter = Route.useSearch({ select: (search) => search.filter })
    const navigate = Route.useNavigate()
    const isOnIndexRoute = !!useMatch({ from: '/', shouldThrow: false })

    return (
      <div className="min-h-screen bg-gray-900 p-6 text-gray-100">
        <Header>
          {isOnIndexRoute ? (
            <SearchForm
              onSearch={(newFilter) => {
                if (filter !== newFilter) {
                  void navigate({
                    search: { filter: newFilter, page: 1 },
                  })
                }
              }}
              defaultValue={filter}
            />
          ) : null}
        </Header>
        <Outlet />
        <TanStackDevtools
          plugins={[
            {
              name: 'TanStack Query',
              render: <ReactQueryDevtoolsPanel />,
            },
            {
              name: 'TanStack Router',
              render: <TanStackRouterDevtoolsPanel />,
            },
          ]}
        />
      </div>
    )
  },
})

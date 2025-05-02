import { createFileRoute } from '@tanstack/react-router'
import { SearchForm } from '@/books/search-form'
import { Header } from '@/books/header'
import { Pagination } from '@/books/pagination'
import { BookSearchItem } from '@/books/book-search-item'
import { bookQueries, limit } from '@/api/openlibrary'
import { useQuery } from '@tanstack/react-query'
import {
  EmptyState,
  ErrorState,
  NoResultsState,
  PendingState,
} from '@/books/search-states'

export const Route = createFileRoute('/')({
  loaderDeps: ({ search }) => search,
  context: ({ deps }) => ({
    bookListQuery: bookQueries.list(deps),
  }),
  loader: ({ context }) => {
    void context.queryClient.prefetchQuery(context.bookListQuery)
  },
  component: App,
})

function App() {
  const filter = Route.useSearch({ select: (search) => search.filter })
  const navigate = Route.useNavigate()

  return (
    <div className="min-h-screen bg-gray-900 p-6 text-gray-100">
      <Header>
        <SearchForm
          onSearch={(newFilter) => {
            void navigate({
              search: { filter: newFilter, page: 1 },
            })
          }}
          defaultValue={filter}
        />
      </Header>
      {filter ? <BookSearchOverview /> : <EmptyState />}
    </div>
  )
}

function BookSearchOverview() {
  const { filter } = Route.useSearch()
  const { bookListQuery } = Route.useRouteContext()
  const query = useQuery({
    ...bookListQuery,
    placeholderData: (previousData) =>
      previousData?.filter === filter ? previousData : undefined,
  })

  if (query.status === 'pending') {
    return <PendingState />
  }

  if (query.status === 'error') {
    return <ErrorState error={query.error} />
  }

  if (query.data.numFound === 0) {
    return <NoResultsState />
  }

  return (
    <div>
      <div className="mb-4 flex justify-end text-sm text-gray-400">
        {query.data.numFound} records found
      </div>

      <div
        className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
        style={{ opacity: query.isPlaceholderData ? 0.5 : 1 }}
      >
        {query.data.docs.map((book) => (
          <BookSearchItem key={book.id} {...book} />
        ))}
      </div>

      <Pagination maxPages={Math.ceil(query.data.numFound / limit)} />
    </div>
  )
}

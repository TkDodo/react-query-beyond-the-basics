import { createFileRoute } from '@tanstack/react-router'
import { SearchForm } from '@/books/search-form'
import { Header } from '@/books/header'
import { Pagination } from '@/books/pagination'
import { BookSearchItem } from '@/books/book-search-item'
import { bookQueries, limit } from '@/api/openlibrary'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import {
  EmptyState,
  ErrorState,
  NoResultsState,
  PendingState,
} from '@/books/search-states'

export const Route = createFileRoute('/')({
  component: App,
})

function App() {
  const { page, filter } = Route.useSearch()
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
      {filter ? (
        <BookSearchOverview filter={filter} page={page} />
      ) : (
        <EmptyState />
      )}
    </div>
  )
}

function BookSearchOverview({
  page,
  filter,
}: {
  filter: string
  page: number
}) {
  const navigate = Route.useNavigate()
  const queryClient = useQueryClient()
  const query = useQuery({
    ...bookQueries.list({ filter, page }),
    placeholderData: (previousData, previousQuery) =>
      previousQuery?.queryHash.includes(filter) ? previousData : undefined,
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
        {query.data.numFound.toString()} records found
      </div>

      <div
        className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
        style={{ opacity: query.isPlaceholderData ? 0.5 : 1 }}
      >
        {query.data.docs.map((book) => (
          <BookSearchItem
            key={book.id}
            {...book}
            onMouseEnter={() => {
              void queryClient.prefetchQuery(bookQueries.detail(book.id))
            }}
            onFocus={() => {
              void queryClient.prefetchQuery(bookQueries.detail(book.id))
            }}
          />
        ))}
      </div>

      <Pagination
        page={page}
        setPage={(newPage) => {
          void navigate({ search: (prev) => ({ ...prev, page: newPage }) })
        }}
        maxPages={Math.ceil(query.data.numFound / limit)}
      />
    </div>
  )
}

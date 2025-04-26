import { createFileRoute } from '@tanstack/react-router'
import { Pagination } from '@/books/pagination'
import { BookSearchItem } from '@/books/book-search-item'
import { bookQueries, limit } from '@/api/openlibrary'
import { useSuspenseQuery } from '@tanstack/react-query'
import { EmptyState, NoResultsState } from '@/books/search-states'
import { useDeferredValue } from 'react'

export const Route = createFileRoute('/')({
  loaderDeps: ({ search }) => search,
  context: ({ deps }) => ({
    bookListQuery: (
      params?: Partial<Parameters<(typeof bookQueries)['list']>[0]>,
    ) =>
      bookQueries.list({
        ...deps,
        ...params,
      }),
  }),
  loader: ({ context }) => {
    void context.queryClient.prefetchQuery(context.bookListQuery())
  },
  component: App,
})

function App() {
  const filter = Route.useSearch({ select: (search) => search.filter })

  return filter ? <BookSearchOverview /> : <EmptyState />
}

function BookSearchOverview() {
  const { page } = Route.useSearch()
  const deferredPage = useDeferredValue(page)
  const isPlaceholderData = page !== deferredPage
  const { bookListQuery } = Route.useRouteContext()

  const query = useSuspenseQuery(bookListQuery({ page: deferredPage }))

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
        style={{ opacity: isPlaceholderData ? 0.5 : 1 }}
      >
        {query.data.docs.map((book) => (
          <BookSearchItem key={book.id} {...book} />
        ))}
      </div>

      <Pagination maxPages={Math.ceil(query.data.numFound / limit)} />
    </div>
  )
}

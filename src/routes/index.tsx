import { createFileRoute, retainSearchParams } from '@tanstack/react-router'
import { useState } from 'react'
import { SearchForm } from '@/books/search-form'
import { Header } from '@/books/header'
import { Pagination } from '@/books/pagination'
import { BookSearchItem } from '@/books/book-search-item'
import { BookDetailItem } from '@/books/book-detail-item'
import { bookQueries, limit } from '@/api/openlibrary'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { type } from 'arktype'
import {
  EmptyState,
  ErrorState,
  NoResultsState,
  PendingState,
} from '@/books/search-states'

const schema = type({
  page: 'number = 1',
  filter: 'string = ""',
})

export const Route = createFileRoute('/')({
  validateSearch: schema,
  search: {
    middlewares: [retainSearchParams(['filter', 'page'])],
  },
  component: App,
})

function App() {
  const { page, filter } = Route.useSearch()
  const navigate = Route.useNavigate()
  const [id, setId] = useState<string>()

  if (id) {
    return (
      <div className="min-h-screen bg-gray-900 p-6 text-gray-100">
        <Header />
        <BookDetail id={id} setId={setId} />
      </div>
    )
  }

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
        <BookSearchOverview filter={filter} setId={setId} page={page} />
      ) : (
        <EmptyState />
      )}
    </div>
  )
}

function BookSearchOverview({
  page,
  setId,
  filter,
}: {
  filter: string
  setId: (id: string) => void
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
            onClick={setId}
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

function BookDetail({
  setId,
  id,
}: {
  id: string
  setId: (id: string | undefined) => void
}) {
  const { page, filter } = Route.useSearch()
  const queryClient = useQueryClient()
  const bookQuery = useQuery({
    ...bookQueries.detail(id),
    placeholderData: () => {
      const listData = queryClient
        .getQueryData(bookQueries.list({ filter, page }).queryKey)
        ?.docs.find((book) => book.id === id)

      return listData
        ? {
            title: listData.title,
            authorId: listData.authorId,
            covers: [listData.coverId],
          }
        : undefined
    },
  })

  const authorId = bookQuery.data?.authorId

  const authorQuery = useQuery({
    ...bookQueries.author(authorId),
    placeholderData: () => {
      const listData = queryClient
        .getQueryData(bookQueries.list({ filter, page }).queryKey)
        ?.docs.find((book) => book.id === id)

      return listData?.authorName
        ? {
            name: listData.authorName,
            link: undefined,
          }
        : undefined
    },
  })

  if (bookQuery.status === 'pending') {
    return <PendingState />
  }

  if (bookQuery.status === 'error') {
    return <ErrorState error={bookQuery.error} />
  }

  return (
    <div>
      <BookDetailItem
        onBack={() => {
          setId(undefined)
        }}
        {...bookQuery.data}
        author={authorQuery.data}
      />
    </div>
  )
}

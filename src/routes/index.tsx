import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { SearchForm } from '@/ui-components/search-form'
import { Header } from '@/ui-components/header'
import { Pagination } from '@/ui-components/pagination'
import { BookSearchItem } from '@/ui-components/book-search-item'
import { BookDetailItem } from '@/ui-components/book-detail-item'
import { bookQueries, limit } from '@/api/openlibrary'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import {
  EmptyState,
  ErrorState,
  NoResultsState,
  PendingState,
} from '@/ui-components/search-states'

export const Route = createFileRoute('/')({
  component: App,
})

function App() {
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [id, setId] = useState<string>()

  if (id) {
    return (
      <div className="min-h-screen bg-gray-900 p-6 text-gray-100">
        <Header />
        <BookDetail id={id} setId={setId} search={search} page={page} />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900 p-6 text-gray-100">
      <Header>
        <SearchForm onSearch={setSearch} defaultValue={search} />
      </Header>
      {search ? (
        <BookSearchOverview
          search={search}
          setId={setId}
          page={page}
          setPage={setPage}
        />
      ) : (
        <EmptyState />
      )}
    </div>
  )
}

function BookSearchOverview({
  page,
  setPage,
  setId,
  search,
}: {
  search: string
  setId: (id: string) => void
  page: number
  setPage: (page: number) => void
}) {
  const queryClient = useQueryClient()
  const query = useQuery({
    ...bookQueries.list({ search, page }),
    placeholderData: (previousData, previousQuery) =>
      previousQuery?.queryHash.includes(search) ? previousData : undefined,
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
        setPage={setPage}
        maxPages={Math.ceil(query.data.numFound / limit)}
      />
    </div>
  )
}

function BookDetail({
  setId,
  id,
  search,
  page,
}: {
  id: string
  search: string
  page: number
  setId: (id: string | undefined) => void
}) {
  const queryClient = useQueryClient()
  const bookQuery = useQuery({
    ...bookQueries.detail(id),
    placeholderData: () => {
      const listData = queryClient
        .getQueryData(bookQueries.list({ search, page }).queryKey)
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
        .getQueryData(bookQueries.list({ search, page }).queryKey)
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

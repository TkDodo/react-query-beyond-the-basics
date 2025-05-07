import { createFileRoute } from '@tanstack/react-router'
import { Header } from '@/books/header'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { bookQueries } from '@/api/openlibrary'
import { ErrorState, PendingState } from '@/books/search-states'
import { BookDetailItem } from '@/books/book-detail-item'

export const Route = createFileRoute('/$id')({
  loader: ({ params, context }) => {
    void context.queryClient.prefetchQuery(bookQueries.detail(params.id))
  },
  component: BookDetail,
})

function BookDetail() {
  const { page, filter } = Route.useSearch()
  const { id } = Route.useParams()

  const queryClient = useQueryClient()
  const bookQuery = useQuery({
    ...bookQueries.detail(id),
    placeholderData: () => {
      const listData = queryClient
        .getQueryData(bookQueries.list({ filter, page }).queryKey)
        ?.docs.find((book) => book.id === id)

      return listData
        ? {
            id: listData.id,
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
      <Header />
      <BookDetailItem {...bookQuery.data} author={authorQuery.data} />
    </div>
  )
}

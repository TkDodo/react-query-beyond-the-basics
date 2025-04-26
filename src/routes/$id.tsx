import { createFileRoute } from '@tanstack/react-router'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { bookQueries } from '@/api/openlibrary'
import { BookDetailItem } from '@/books/book-detail-item'
import { use } from 'react'

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
            link: undefined,
          }
        : undefined
    },
  })

  const data = bookQuery.data ? bookQuery.data : use(bookQuery.promise)

  return <BookDetailItem {...data} author={authorQuery.data} />
}

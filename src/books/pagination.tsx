import { ChevronLeft, ChevronRight } from 'lucide-react'

export function Pagination({
  page,
  setPage,
  maxPages,
}: {
  page: number
  setPage: (page: number) => void
  maxPages: number
}) {
  return (
    <div className="mt-6 flex items-center justify-end gap-4 text-sm text-gray-300">
      {page === 1 ? (
        <span className="rounded bg-gray-800 px-3 py-2 opacity-40">
          <ChevronLeft className="h-4 w-4" />
        </span>
      ) : (
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault()
            setPage(page - 1)
          }}
          className="cursor-pointer rounded bg-gray-700 px-3 py-2 hover:bg-gray-600"
        >
          <ChevronLeft className="h-4 w-4" />
        </a>
      )}
      <span className="inline-block w-16 text-center">Page {page}</span>
      {page === maxPages ? (
        <span className="rounded bg-gray-800 px-3 py-2 opacity-40">
          <ChevronRight className="h-4 w-4" />
        </span>
      ) : (
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault()
            setPage(page + 1)
          }}
          className="cursor-pointer rounded bg-gray-700 px-3 py-2 hover:bg-gray-600"
        >
          <ChevronRight className="h-4 w-4" />
        </a>
      )}
    </div>
  )
}

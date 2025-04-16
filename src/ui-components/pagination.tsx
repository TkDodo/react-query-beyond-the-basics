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
      <button
        type="button"
        onClick={() => {
          setPage(page - 1)
        }}
        disabled={page === 1}
        className="cursor-pointer rounded bg-gray-700 px-3 py-2 hover:bg-gray-600 disabled:cursor-not-allowed disabled:opacity-40"
      >
        <ChevronLeft className="h-4 w-4" />
      </button>
      <span className="inline-block w-16 text-center">Page {page}</span>
      <button
        type="button"
        disabled={page === maxPages}
        onClick={() => {
          setPage(page + 1)
        }}
        className="cursor-pointer rounded bg-gray-700 px-3 py-2 hover:bg-gray-600 disabled:cursor-not-allowed disabled:opacity-40"
      >
        <ChevronRight className="h-4 w-4" />
      </button>
    </div>
  )
}

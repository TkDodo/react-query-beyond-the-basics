import { CoverImage } from '@/books/cover-image'
import type { BookSearchItem } from '@/api/openlibrary'
import { Link } from '@tanstack/react-router'

type Props = BookSearchItem &
  Omit<React.ComponentProps<'a'>, 'href' | 'className'>

export function BookSearchItem({
  id,
  coverId,
  authorId,
  authorName,
  title,
  publishYear,
  ...props
}: Props) {
  return (
    <Link
      to="/$id"
      params={{ id }}
      className="group block rounded-xl border border-transparent transition-transform duration-200 ease-out hover:-translate-y-1 hover:border-indigo-400 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400 focus:outline-none"
      {...props}
    >
      <div className="flex items-start space-x-4 rounded-xl bg-gray-800 p-4 shadow transition group-hover:shadow-lg">
        <CoverImage id={String(coverId)} title={title} />
        <div className="flex flex-col justify-start">
          <h3 className="mb-1 text-lg font-semibold text-white">{title}</h3>
          <p className="text-sm text-gray-400">{authorName}</p>
          <p className="mt-2 text-xs text-gray-500">
            Published in {publishYear}
          </p>
        </div>
      </div>
    </Link>
  )
}

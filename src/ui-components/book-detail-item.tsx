import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { CoverImage } from '@/ui-components/cover-image'
import type { Author, BookDetailItem } from '@/api/openlibrary'

type Props = Omit<BookDetailItem, 'author'> & {
  onBack: () => void
  author?: Author
}

export function BookDetailItem({
  title,
  author,
  description,
  links,
  covers,
  onBack,
}: Props) {
  const authorName = author?.name ?? '...'

  return (
    <div className="mx-auto max-w-3xl">
      <a
        href="#"
        onClick={(e) => {
          e.preventDefault()
          onBack()
        }}
        className="mb-4 inline-block rounded text-sm text-indigo-400 hover:underline focus:ring-2 focus:ring-indigo-400 focus:outline-none"
      >
        ← Back to search
      </a>
      <div className="rounded-xl bg-gray-800 p-6 text-gray-100 shadow-md">
        <h2 className="text-2xl font-bold text-white">{title}</h2>

        <p className="mb-4 text-sm text-gray-400">
          {author?.link ? (
            <a
              href={author.link}
              target="_blank"
              rel="noopener noreferrer"
              className="text-indigo-400 hover:underline"
            >
              {authorName}
            </a>
          ) : (
            authorName
          )}
        </p>

        {covers && covers.length > 0 && (
          <div className="mb-6 flex space-x-4">
            {covers.slice(0, 5).map((src) => (
              <CoverImage key={src} id={String(src)} title={title} />
            ))}
          </div>
        )}

        <div className="prose mb-4 max-w-none whitespace-pre-line text-gray-300">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {description}
          </ReactMarkdown>
        </div>
      </div>

      {links && links.length > 0 && (
        <div className="mt-6">
          <h3 className="mb-2 text-lg font-semibold text-white">
            Related Links
          </h3>
          <ul className="space-y-2">
            {links.map((link) => (
              <li key={link.url}>
                <a
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-indigo-400 hover:underline"
                >
                  {link.title}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

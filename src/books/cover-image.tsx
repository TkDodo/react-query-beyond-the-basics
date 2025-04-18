import { useState } from 'react'

type Props = {
  id: string
  title: string
  size?: 'L' | 'M'
}

export function CoverImage({ id, title, size = 'M' }: Props) {
  const [isLoaded, setLoaded] = useState(false)

  return (
    <>
      {!isLoaded && (
        <div className="h-36 w-24 animate-pulse rounded bg-gray-600" />
      )}
      <img
        src={`https://covers.openlibrary.org/b/id/${id}-${size}.jpg`}
        alt={title}
        className={`h-36 w-24 rounded object-cover transition-opacity duration-300 ${isLoaded ? '' : 'hidden'}`}
        onLoad={() => {
          setLoaded(true)
        }}
      />
    </>
  )
}

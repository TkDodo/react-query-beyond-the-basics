import { LibraryBig } from 'lucide-react'

type Props = {
  children?: React.ReactNode
}

export function Header({ children }: Props) {
  return (
    <div className="mb-6 flex flex-col items-start justify-between gap-4 lg:flex-row lg:items-center">
      <div className="flex items-center space-x-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-indigo-500 shadow-md">
          <LibraryBig className="h-8 w-8 text-white" />
        </div>
        <h1 className="text-2xl font-semibold text-white">
          OpenLibrary Explorer
        </h1>
      </div>

      {children}
    </div>
  )
}

import { Search } from 'lucide-react'

type Props = {
  defaultValue: string
  onSearch: (query: string) => void
}

export function SearchForm({ defaultValue, onSearch }: Props) {
  return (
    <form
      onSubmit={(event) => {
        event.preventDefault()
        const formData = new FormData(event.currentTarget)
        const searchQuery = formData.get('search') as string
        onSearch(searchQuery)
      }}
      className="flex w-full items-center space-x-2 lg:w-auto"
    >
      <input
        defaultValue={defaultValue}
        autoComplete="off"
        name="search"
        type="text"
        placeholder="e.g. Dragons, Sherlock Holmes, ..."
        className="w-full rounded-md border border-gray-700 bg-gray-800 px-4 py-2 text-white shadow-sm focus:ring-2 focus:ring-indigo-400 focus:outline-none lg:w-auto"
      />
      <button
        type="submit"
        className="flex items-center space-x-1 rounded-md bg-indigo-600 px-4 py-2 text-white shadow hover:cursor-pointer hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-400 focus:outline-none active:bg-indigo-800"
      >
        <Search className="h-4 w-4" />
        <span>Search</span>
      </button>
    </form>
  )
}

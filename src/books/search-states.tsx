import {
  Search,
  SearchCheck,
  FileWarning,
  Loader2,
  AlertTriangle,
} from 'lucide-react'

const SpotIcon = ({
  icon: Icon,
  label,
}: {
  icon: typeof Search
  label: string
}) => (
  <div className="mt-20 flex flex-col items-center justify-center space-y-4 text-center text-gray-400">
    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gray-800 shadow">
      <Icon className="h-8 w-8 text-indigo-400" />
    </div>
    <p className="text-lg font-medium">{label}</p>
  </div>
)

export function EmptyState() {
  return (
    <SpotIcon
      icon={SearchCheck}
      label="Please type into the search field to make a query."
    />
  )
}

export function NoResultsState() {
  return (
    <SpotIcon
      icon={FileWarning}
      label="No results found for your query. Try another search."
    />
  )
}

export function PendingState() {
  return (
    <div className="flex h-64 items-center justify-center">
      <Loader2 className="h-10 w-10 animate-spin text-indigo-400" />
    </div>
  )
}

export function ErrorState({ error }: { error: Error }) {
  return (
    <div className="mx-auto mt-10 flex max-w-xl items-start space-x-4 rounded-md border border-red-500 bg-red-950 p-4 text-red-300 shadow-md">
      <AlertTriangle className="h-6 w-6 text-red-400" />
      <p className="text-sm leading-relaxed font-medium">{error.message}</p>
    </div>
  )
}

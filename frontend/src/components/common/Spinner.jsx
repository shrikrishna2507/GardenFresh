export default function Spinner({ fullPage = false, size = 'md' }) {
  const sizes = { sm: 'w-4 h-4', md: 'w-8 h-8', lg: 'w-12 h-12' }
  const spinner = (
    <div className={`${sizes[size]} border-4 border-green-100 border-t-green-600 rounded-full animate-spin`} />
  )
  if (fullPage) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white z-50">
        <div className="flex flex-col items-center gap-3">
          {spinner}
          <p className="text-sm text-gray-500 font-medium">Loading...</p>
        </div>
      </div>
    )
  }
  return <div className="flex justify-center py-8">{spinner}</div>
}

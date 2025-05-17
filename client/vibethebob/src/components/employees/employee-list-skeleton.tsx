export function EmployeeListSkeleton() {
  return (
    <div className="rounded-md border">
      <div className="border-b px-4 py-5 sm:px-6">
        <div className="h-6 w-24 animate-pulse rounded bg-gray-200" />
      </div>
      <div className="divide-y divide-gray-200 bg-white">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="px-4 py-4 sm:px-6">
            <div className="flex items-center justify-between">
              <div className="space-y-3">
                <div className="h-4 w-48 animate-pulse rounded bg-gray-200" />
                <div className="h-4 w-32 animate-pulse rounded bg-gray-200" />
              </div>
              <div className="h-8 w-8 animate-pulse rounded-full bg-gray-200" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 
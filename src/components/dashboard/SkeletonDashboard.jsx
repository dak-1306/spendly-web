import Card from "../common/Card.jsx";

export default function SkeletonDashboard() {
  return (
    <div className="space-y-6">
      {/* Header: change date control + month */}
      <div className="flex items-center gap-3 mx-auto w-full max-w-4xl">
        <div className="flex items-center gap-3">
          <div className="h-10 w-28 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse" />
          <div className="h-8 w-24 rounded bg-gray-200 dark:bg-gray-700 animate-pulse" />
        </div>
        <div className="ml-auto h-6 w-28 rounded bg-gray-200 dark:bg-gray-700 animate-pulse" />
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-6xl mx-auto">
        {[0, 1, 2, 3].map((i) => (
          <Card key={i}>
            <div className="h-4 w-32 bg-gray-200 dark:bg-gray-700 rounded mb-3 animate-pulse" />
            <div className="h-8 w-full bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
          </Card>
        ))}
      </div>

      {/* Charts: pie + spending card */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 max-w-6xl mx-auto">
        <Card className="col-span-2">
          <div className="flex gap-6 items-center p-4">
            <div className="flex-shrink-0">
              <div className="rounded-full bg-gray-200 dark:bg-gray-700 w-36 h-36 animate-pulse" />
            </div>
            <div className="flex-1 space-y-3">
              {[0, 1, 2].map((c) => (
                <div key={c} className="flex items-center justify-between">
                  <div className="h-4 w-1/3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                  <div className="h-4 w-20 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                </div>
              ))}
            </div>
          </div>
        </Card>

        <Card className="col-span-1">
          <div className="p-4 space-y-4">
            <div className="h-4 w-40 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
            <div className="h-10 w-full bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
            <div className="h-3 w-3/4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
          </div>
        </Card>
      </div>

      {/* Bar chart */}
      <Card className="max-w-6xl mx-auto">
        <div className="p-4">
          <div className="flex items-end gap-3 h-40">
            {[30, 50, 20, 70, 40, 60, 25].map((h, idx) => (
              <div key={idx} className="flex-1">
                <div
                  style={{ height: `${h}%` }}
                  className="w-full bg-gray-200 dark:bg-gray-700 rounded-b animate-pulse"
                />
              </div>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
}

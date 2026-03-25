import Card from "../common/Card.jsx";

export default function SkeletonIncome({ rows = 3 }) {
  const items = Array.from({ length: rows });

  return (
    <Card className="flex flex-col">
      {/* Header: page title + add button */}
      <div className="flex justify-between items-center mb-4">
        <div className="h-6 w-64 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
        <div className="h-10 w-36 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
      </div>

      {/* List skeleton */}
      <div className="overflow-x-auto">
        <ul>
          {items.map((_, i) => (
            <li
              key={i}
              className="py-2 border-b border-gray-300 dark:border-gray-600 flex justify-between items-center"
            >
              <div className="flex items-center gap-4">
                <div className="h-6 w-6 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse" />
                <div className="space-y-2">
                  <div className="h-4 w-48 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                  <div className="h-3 w-36 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                </div>
                <div className="h-3 w-24 bg-gray-200 dark:bg-gray-700 rounded ml-4 animate-pulse" />
              </div>

              <div className="flex items-center gap-4">
                <div className="h-5 w-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                <div className="flex gap-2">
                  <div className="h-8 w-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                  <div className="h-8 w-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                  <div className="h-8 w-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Pagination skeleton */}
      <div className="flex justify-end mt-4 gap-2">
        <div className="h-8 w-20 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
        <div className="h-8 w-20 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
      </div>
    </Card>
  );
}

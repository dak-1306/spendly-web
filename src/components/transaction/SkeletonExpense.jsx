import Card from "../common/Card.jsx";

export default function SkeletonExpense({ rows = 5 }) {
  const items = Array.from({ length: rows });

  return (
    <Card>
      {/* Filter area + Add button */}
      <div className="flex justify-between items-center mb-4 space-x-4">
        <div className="flex-1 space-y-2">
          <div className="h-10 w-64 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
          <div className="h-8 w-48 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
        </div>
        <div className="h-10 w-36 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
      </div>

      {/* Separator */}
      <div className="h-px bg-gray-200 dark:bg-gray-700 rounded mb-4" />

      {/* Table skeleton */}
      <div className="overflow-x-auto">
        <table className="w-full mt-4 table-auto">
          <thead>
            <tr className="text-left border-b border-gray-300">
              <th className="px-4 py-2">
                <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
              </th>
              <th className="px-4 py-2">
                <div className="h-4 w-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
              </th>
              <th className="px-4 py-2">
                <div className="h-4 w-20 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
              </th>
              <th className="px-4 py-2">
                <div className="h-4 w-20 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
              </th>
              <th className="px-4 py-2">
                <div className="h-4 w-16 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
              </th>
            </tr>
          </thead>
          <tbody>
            {items.map((_, i) => (
              <tr
                key={i}
                className="border-b border-gray-200 dark:border-gray-700"
              >
                <td className="px-4 py-4">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-36 animate-pulse" />
                </td>
                <td className="px-4 py-4">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-48 animate-pulse" />
                </td>
                <td className="px-4 py-4">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-28 animate-pulse" />
                </td>
                <td className="px-4 py-4">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24 animate-pulse" />
                </td>
                <td className="px-4 py-4 flex gap-2">
                  <div className="h-6 w-10 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                  <div className="h-6 w-10 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                  <div className="h-6 w-10 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination skeleton */}
      <div className="flex justify-end mt-4 gap-2">
        <div className="h-8 w-20 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
        <div className="h-8 w-20 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
      </div>
    </Card>
  );
}

import Card from "../common/Card.jsx";

export default function SkeletonTransaction({ view = "list", rows = 5 }) {
  const items = Array.from({ length: rows });

  if (view === "table") {
    return (
      <div className="overflow-x-auto">
        <table className="w-full table-auto">
          <thead>
            <tr className="text-left">
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
              <th className="px-4 py-2" />
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
                <td className="px-4 py-4">
                  <div className="h-6 w-20 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  // list view (income)
  return (
    <div className="space-y-2">
      {items.map((_, i) => (
        <Card key={i} className="flex justify-between items-center">
          <div className="space-y-1 w-3/4">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-48 animate-pulse" />
            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-32 animate-pulse" />
          </div>
          <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-20 animate-pulse" />
        </Card>
      ))}
    </div>
  );
}

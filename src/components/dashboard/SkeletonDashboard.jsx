import Card from "../common/Card.jsx";

export default function SkeletonDashboard() {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-4 gap-4 mb-4">
        {[0, 1, 2, 3].map((i) => (
          <Card key={i}>
            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-3 animate-pulse" />
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-full animate-pulse" />
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-4">
        <Card className="col-span-2">
          <div className="h-40 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
        </Card>

        <Card className="col-span-1">
          <div className="h-40 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
        </Card>
      </div>

      <Card className="mt-6">
        <div className="h-48 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
      </Card>
    </div>
  );
}

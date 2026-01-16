const SpendingCard = ({ current, limit }) => {
  const percent = Math.min((current / limit) * 100, 100);
  const isOverLimit = current >= limit;

  return (
    <div className="p-4 rounded border w-full max-w-sm">
      {/* Header */}
      <div className="mb-3">
        <h3 className="font-medium">Chi tiêu hàng tháng</h3>
        <p className="text-sm text-gray-500">
          {current} / {limit}
        </p>
      </div>

      {/* Water container */}
      <div className="relative h-40 w-full border rounded overflow-hidden">
        {/* Water */}
        <div
          className={`absolute bottom-0 left-0 w-full transition-all
            ${isOverLimit ? "bg-red-500" : "bg-blue-500"}
          `}
          style={{ height: `${percent}%` }} // 🔧 mực nước
        />

        {/* Limit line */}
        <div
          className="absolute left-0 w-full border-t border-dashed"
          style={{ bottom: "100%" }} // 🔧 chỉnh vị trí vạch ngưỡng
        />
      </div>

      {/* Status */}
      <div className="mt-3 text-sm font-medium">
        {isOverLimit ? "Vượt giới hạn" : "Trong giới hạn"}
      </div>
    </div>
  );
};

export default SpendingCard;

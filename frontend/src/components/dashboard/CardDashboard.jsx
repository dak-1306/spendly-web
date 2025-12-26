function CardDashboard({ type, title, amount = 0, currency = "VND", icon }) {
  const baseMap = {
    income: "bg-[var(--secondary-blue-color)]",
    expense: "bg-red-500",
    balance: "bg-yellow-500",
    compare: "bg-blue-500",
  };

  // nếu là compare: tăng (expense tăng) => đỏ, giảm => xanh, bằng => xám
  let bgColor = baseMap[type] || "bg-gray-500";
  if (type === "compare") {
    if (amount > 0) bgColor = "bg-red-500";
    else if (amount < 0) bgColor = "bg-green-500";
    else bgColor = "bg-gray-500";
  }

  // format số chung; với compare hiển thị dấu +/-
  const formatted =
    type === "compare"
      ? `${amount > 0 ? "+" : amount < 0 ? "-" : ""}${Math.abs(
          Number(amount)
        ).toFixed(2)} ${currency}`
      : new Intl.NumberFormat("vi-VN").format(amount) + " " + currency;

  return (
    <div
      className={`flex items-center space-x-4 p-4 ${bgColor} rounded-lg shadow-md`}
    >
      {icon && (
        <img
          src={icon.src}
          alt={icon.alt}
          className={`w-[${icon.width}px] h-[${icon.height}px]`}
        />
      )}
      <div>
        <p className="text-lg font-semibold text-white">{formatted}</p>
        <p className="text-sm text-white/80">{title}</p>
      </div>
    </div>
  );
}
export default CardDashboard;

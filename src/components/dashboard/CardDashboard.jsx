import {
  DollarSign,
  CreditCard,
  Wallet,
  ArrowUp,
  ArrowDown,
} from "lucide-react";
import Card from "../common/Card";
function CardDashboard({ type, title, amount = 0, currency = "VND" }) {
  const baseMap = {
    income: "border-green-600",
    expense: "border-red-600",
    balance: "border-blue-600",
    compare: "bg-blue-600",
  };

  const textColor = {
    income: "text-green-600",
    expense: "text-red-600",
    balance: "text-blue-600",
    compare:
      amount > 0
        ? "text-green-600"
        : amount < 0
          ? "text-red-600"
          : "text-gray-600",
  };

  const iconColor = {
    income: <DollarSign className="text-green-600" />,
    expense: <CreditCard className="text-red-600" />,
    balance: <Wallet className="text-blue-600" />,
    compare:
      amount > 0 ? (
        <ArrowUp className="text-green-600" />
      ) : amount < 0 ? (
        <ArrowDown className="text-red-600" />
      ) : (
        <DollarSign className="text-gray-600" />
      ),
  };

  // nếu là compare: tăng (expense tăng) => đỏ, giảm => xanh, bằng => xám
  let borderColor = baseMap[type] || "bg-gray-600";
  if (type === "compare") {
    if (amount > 0) borderColor = "border-green-600";
    else if (amount < 0) borderColor = "border-red-600";
    else borderColor = "bg-gray-600";
  }

  // format số chung; với compare hiển thị dấu +/-
  const formatted =
    type === "compare"
      ? `${amount > 0 ? "+" : amount < 0 ? "-" : ""}${Math.abs(
          Number(amount),
        ).toFixed(2)} ${currency}`
      : new Intl.NumberFormat("vi-VN").format(amount) + " " + currency;

  return (
    <Card className={`flex items-center space-x-4 p-4  border ${borderColor}`}>
      {iconColor[type] || <DollarSign className="text-gray-600" />}

      <p className={`text-lg font-semibold ${textColor[type]}`}>{formatted}</p>
      <p className="text-sm ">{title}</p>
    </Card>
  );
}
export default CardDashboard;

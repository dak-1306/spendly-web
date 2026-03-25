import { useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { useTheme } from "../../hooks/useTheme";

const formatMoney = (v) =>
  new Intl.NumberFormat("vi-VN", {
    maximumFractionDigits: 0,
  }).format(v);

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div
        style={{
          background: "#111",
          color: "#fff",
          padding: "6px 10px",
          borderRadius: "6px",
          fontSize: "12px",
        }}
      >
        Day {label}: {formatMoney(payload[0].value)}
      </div>
    );
  }
  return null;
};

function SpendingBarChart({ month, title, expenses = [] }) {
  const theme = useTheme();

  const data = useMemo(() => {
    const [year, monthNum] = month.split("-").map(Number);
    const daysCount = new Date(year, monthNum, 0).getDate();

    const totals = Array.from({ length: daysCount }, (_, i) => ({
      day: i + 1,
      amount: 0,
    }));

    expenses.forEach((e) => {
      const d = new Date(e.date);
      if (d.getFullYear() === year && d.getMonth() + 1 === monthNum) {
        totals[d.getDate() - 1].amount += Number(e.amount) || 0;
      }
    });

    return totals;
  }, [month, expenses]);

  return (
    <div className="w-full h-[350px] pb-8">
      <h2 className="text-xl font-semibold mb-4 text-blue-600 dark:text-blue-400">
        {title}
      </h2>

      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <CartesianGrid
            strokeDasharray="3 3"
            stroke={theme === "light" ? "#eee" : "#333"}
          />

          <XAxis
            dataKey="day"
            tick={{ fill: theme === "light" ? "#555" : "#aaa" }}
          />

          <YAxis
            tickFormatter={formatMoney}
            tick={{ fill: theme === "light" ? "#555" : "#aaa" }}
            width={80}
          />

          <Tooltip content={CustomTooltip} />
          <Legend />

          <Bar
            dataKey="amount"
            name="Expense"
            fill="#3b82f6"
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default SpendingBarChart;

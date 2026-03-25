import { useMemo } from "react";
import {
  PieChart,
  Pie,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from "recharts";

const formatMoney = (v) =>
  new Intl.NumberFormat("vi-VN", {
    maximumFractionDigits: 0,
  }).format(v);

const COLORS = [
  "#3b82f6",
  "#ef4444",
  "#10b981",
  "#f59e0b",
  "#8b5cf6",
  "#06b6d4",
  "#f97316",
  "#a3a3a3",
];

const CustomTooltip = ({ active, payload }) => {
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
        {payload[0].name}: {formatMoney(payload[0].value)} VND
      </div>
    );
  }
  return null;
};

function SpendingPieChart({ month, title, expenses = [] }) {
  const { data, total } = useMemo(() => {
    const map = new Map();
    const [year, monthNum] = month
      ? month.split("-").map(Number)
      : [null, null];

    expenses.forEach((e) => {
      if (!e) return;

      if (month) {
        const d = new Date(e.date);
        if (!(d.getFullYear() === year && d.getMonth() + 1 === monthNum))
          return;
      }

      const cat = e.category || "Khác";
      const amt = Number(e.amount) || 0;
      map.set(cat, (map.get(cat) || 0) + amt);
    });

    const arr = Array.from(map.entries()).map(([name, value]) => ({
      name,
      value,
    }));

    const totalValue = arr.reduce((s, i) => s + i.value, 0);

    return { data: arr, total: totalValue };
  }, [month, expenses]);

  return (
    <div className="w-full h-[320px] pb-8">
      <h2 className="text-xl font-semibold text-blue-500">{title}</h2>

      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            innerRadius={70}
            outerRadius={100}
            paddingAngle={3}
          >
            {data.map((entry, index) => (
              <Cell key={index} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>

          {/* Total text in center */}
          <text
            x="50%"
            y="48%"
            textAnchor="middle"
            dominantBaseline="middle"
            style={{ fontSize: "14px", fill: "#888" }}
          >
            Total
          </text>

          <text
            x="50%"
            y="55%"
            textAnchor="middle"
            dominantBaseline="middle"
            style={{ fontSize: "16px", fontWeight: "bold" }}
          >
            {formatMoney(total)}
          </text>

          <Tooltip content={CustomTooltip} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

export default SpendingPieChart;

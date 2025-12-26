import React, { useMemo } from "react";

/**
 * Props:
 * - month: "YYYY-MM"
 * - expenses: array of expense items with { amount, date } (date ISO string)
 *
 * Simple SVG bar chart showing total expense per day in the given month.
 */
function SpendingBarChart({
  month,
  expenses = [],
  width = 1000,
  height = 240,
}) {
  const { days, dailyTotals, max, tickVals } = useMemo(() => {
    const [year, monthNum] = month.split("-").map(Number);
    const daysCount = new Date(year, monthNum, 0).getDate(); // days in month
    const totals = Array.from({ length: daysCount }, () => 0);

    expenses.forEach((e) => {
      const d = new Date(e.date);
      if (d.getFullYear() === year && d.getMonth() + 1 === monthNum) {
        const day = d.getDate();
        totals[day - 1] += Number(e.amount) || 0;
      }
    });

    const rawMax = Math.max(...totals, 0);
    const actualMax = rawMax === 0 ? 0 : rawMax;

    // generate reasonable ticks (avoid duplicates from rounding)
    const yTicks = 4;
    let vals;
    if (actualMax === 0) {
      vals = [0];
    } else {
      const step = Math.ceil(actualMax / yTicks);
      vals = Array.from({ length: yTicks + 1 }, (_, i) => {
        const v = step * i;
        return i === yTicks ? actualMax : v;
      });
      // ensure uniqueness and ascending
      vals = Array.from(new Set(vals)).sort((a, b) => a - b);
      if (vals[vals.length - 1] !== actualMax) vals.push(actualMax);
    }

    return {
      days: daysCount,
      dailyTotals: totals,
      max: actualMax === 0 ? 1 : actualMax, // used for scaling; keep 1 to avoid div0
      tickVals: vals,
    };
  }, [month, expenses]);

  const margin = { top: 16, right: 12, bottom: 28, left: 80 }; // tăng lề trái để chứa nhãn lớn
  const chartW = width - margin.left - margin.right;
  const chartH = height - margin.top - margin.bottom;
  const barSlot = chartW / days;
  const barW = Math.max(2, barSlot - 6);

  const fmt = (v) =>
    new Intl.NumberFormat("vi-VN", { maximumFractionDigits: 0 }).format(v);

  return (
    <div className="w-full overflow-auto">
      <svg
        viewBox={`0 0 ${width} ${height}`}
        width="100%"
        height={height}
        preserveAspectRatio="xMinYMin meet"
        role="img"
        aria-label="Spending per day"
      >
        <g transform={`translate(${margin.left},${margin.top})`}>
          {/* Y axis ticks & labels (compute y from value) */}
          {tickVals.map((t) => {
            const y = chartH - (t / max) * chartH; // 0 => bottom, max => top
            return (
              <g key={t}>
                <line
                  x1={-8}
                  x2={chartW}
                  y1={y}
                  y2={y}
                  stroke="#e6e6e6"
                  strokeWidth={1}
                />
                <text
                  x={-12}
                  y={y + 4}
                  textAnchor="end"
                  fontSize={11}
                  fill="#666"
                >
                  {fmt(t)}
                </text>
              </g>
            );
          })}

          {/* Bars */}
          {dailyTotals.map((val, i) => {
            const x = i * barSlot + (barSlot - barW) / 2;
            const h = (val / max) * chartH;
            const y = chartH - h;
            return (
              <g key={i} transform={`translate(${x},0)`}>
                <rect
                  x={0}
                  y={y}
                  width={barW}
                  height={h}
                  fill={val > 0 ? "#3b82f6" : "#e5e7eb"}
                  rx={2}
                />
                {/* show day label only if this day has expense */}
                {val > 0 && (
                  <text
                    x={barW / 2}
                    y={chartH + 14}
                    textAnchor="middle"
                    fontSize={10}
                    fill="#444"
                  >
                    {i + 1}
                  </text>
                )}
              </g>
            );
          })}

          {/* bottom axis line */}
          <line
            x1={0}
            x2={chartW}
            y1={chartH}
            y2={chartH}
            stroke="#000"
            strokeOpacity={0.08}
          />
        </g>
      </svg>
    </div>
  );
}

export default SpendingBarChart;

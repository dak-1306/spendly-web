import React, { useMemo, useState } from "react";

/**
 * Props:
 * - month: "YYYY-MM" (optional, used if filtering expenses by month)
 * - expenses: array of { amount, date, category, title }
 * - width, height: numbers (default 360x240)
 * - colors: optional object or array for category colors
 *
 * Renders an SVG pie chart of expense amounts grouped by category with a legend.
 */
function SpendingPieChart({
  month,
  title,
  expenses = [],
  width = 420,
  height = 320,
  colors,
}) {
  const [hoverIndex, setHoverIndex] = useState(null);

  const { groups, total } = useMemo(() => {
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

    const arr = Array.from(map.entries()).map(([category, amount]) => ({
      category,
      amount,
    }));

    arr.sort((a, b) => b.amount - a.amount);
    const tot = arr.reduce((s, it) => s + it.amount, 0);

    return { groups: arr, total: tot };
  }, [month, expenses]);

  const palette = colors || [
    "#3b82f6",
    "#ef4444",
    "#10b981",
    "#f59e0b",
    "#8b5cf6",
    "#06b6d4",
    "#f97316",
    "#a3a3a3",
  ];

  // center & radius (adjust as needed)
  // leave room at bottom for the "Tổng" label by subtracting 60px from height
  const r = Math.min(width, Math.max(0, height - 60)) / 2 - 8;
  const cx = width / 2;
  const cy = Math.max(r + 12, r); // place circle near top with some padding

  // describe arc correctly: startAngle -> endAngle (degrees)
  const describeArc = (cx, cy, r, startDeg, endDeg) => {
    const polarToCartesian = (centerX, centerY, radius, angleInDegrees) => {
      const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0;
      return {
        x: centerX + radius * Math.cos(angleInRadians),
        y: centerY + radius * Math.sin(angleInRadians),
      };
    };

    const start = polarToCartesian(cx, cy, r, startDeg);
    const end = polarToCartesian(cx, cy, r, endDeg);
    const largeArcFlag = endDeg - startDeg > 180 ? "1" : "0";
    const sweepFlag = "1"; // draw clockwise

    // Move to center, line to start point, arc to end point, close
    return [
      `M ${cx} ${cy}`,
      `L ${start.x} ${start.y}`,
      `A ${r} ${r} 0 ${largeArcFlag} ${sweepFlag} ${end.x} ${end.y}`,
      "Z",
    ].join(" ");
  };

  let angleStart = -90;
  const slices = groups.map((g, i) => {
    const portion = total > 0 ? g.amount / total : 0;
    const angle = portion * 360;
    const start = angleStart;
    const end = angleStart + angle;
    angleStart = end;
    return {
      ...g,
      index: i,
      start,
      end,
      color: palette[i % palette.length],
      percent: total > 0 ? portion * 100 : 0,
      portion,
    };
  });

  const fmtAmount = (v) =>
    new Intl.NumberFormat("vi-VN", { maximumFractionDigits: 0 }).format(v);

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4 text-[var(--primary-blue-color)]">
        {title}
      </h2>
      <div className="flex flex-col md:flex-row gap-4 items-start">
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <svg
            width={width}
            height={height}
            viewBox={`0 0 ${width} ${height}`}
            role="img"
            aria-label="Spending by category pie chart"
          >
            <g>
              {/* background circle when no data */}
              {total === 0 && (
                <circle cx={cx} cy={cy} r={r} fill="#f3f4f6" stroke="#e5e7eb" />
              )}

              {slices.map((s, idx) => {
                if (s.amount === 0) return null;

                // handle full-circle (single category covers ~100%)
                if (s.portion >= 0.9999) {
                  return (
                    <g key={s.category}>
                      <circle
                        cx={cx}
                        cy={cy}
                        r={r}
                        fill={s.color}
                        stroke="#fff"
                        strokeWidth={1}
                        onMouseEnter={() => setHoverIndex(idx)}
                        onMouseLeave={() => setHoverIndex(null)}
                      >
                        <title>{`${s.category}: ${fmtAmount(
                          s.amount
                        )} (${s.percent.toFixed(2)}%)`}</title>
                      </circle>
                    </g>
                  );
                }

                const path = describeArc(cx, cy, r, s.start, s.end);
                const isHover = hoverIndex === idx;
                return (
                  <g key={s.category}>
                    <path
                      d={path}
                      fill={s.color}
                      opacity={isHover ? 0.95 : 1}
                      stroke="#fff"
                      strokeWidth={1}
                      onMouseEnter={() => setHoverIndex(idx)}
                      onMouseLeave={() => setHoverIndex(null)}
                    >
                      <title>{`${s.category}: ${fmtAmount(
                        s.amount
                      )} (${s.percent.toFixed(2)}%)`}</title>
                    </path>
                  </g>
                );
              })}
            </g>
          </svg>

          {/* moved total label below the chart to avoid overlap */}
          <div style={{ textAlign: "center", marginTop: 8 }}>
            <div style={{ fontSize: 14, fontWeight: 600, color: "#111827" }}>
              Tổng
            </div>
            <div style={{ fontSize: 13, color: "#374151" }}>
              {fmtAmount(total)} VND
            </div>
          </div>
        </div>

        <div style={{ minWidth: 140 }}>
          {slices.length === 0 && (
            <div className="text-sm text-gray-500">Không có dữ liệu</div>
          )}
          <ul className="space-y-2">
            {slices.map((s, idx) => (
              <li
                key={s.category}
                onMouseEnter={() => setHoverIndex(idx)}
                onMouseLeave={() => setHoverIndex(null)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  opacity:
                    hoverIndex === null ? 1 : hoverIndex === idx ? 1 : 0.6,
                  cursor: "default",
                }}
              >
                <span
                  style={{
                    width: 12,
                    height: 12,
                    background: s.color,
                    display: "inline-block",
                    borderRadius: 3,
                  }}
                />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, color: "#0f172a" }}>
                    {s.category}
                  </div>
                  <div style={{ fontSize: 12, color: "#6b7280" }}>
                    {fmtAmount(s.amount)} VND • {s.percent.toFixed(2)}%
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default SpendingPieChart;

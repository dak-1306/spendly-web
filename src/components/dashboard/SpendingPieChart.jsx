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
const PIE_CHART_CONFIG = { WIDTH: 440, HEIGHT: 240 };
function SpendingPieChart({ month, title, expenses = [] }) {
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

  const palette = [
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
  const r =
    Math.min(
      PIE_CHART_CONFIG.WIDTH,
      Math.max(0, PIE_CHART_CONFIG.HEIGHT - 60),
    ) /
      2 -
    8;
  const cx = PIE_CHART_CONFIG.WIDTH / 2;
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
      <h2 className="text-xl font-semibold mb-4 text-blue-500">{title}</h2>
      <div className="flex flex-col md:flex-row gap-4 items-start">
        <div className="flex flex-col items-center">
          <svg
            width={PIE_CHART_CONFIG.WIDTH}
            height={PIE_CHART_CONFIG.HEIGHT}
            viewBox={`0 0 ${PIE_CHART_CONFIG.WIDTH} ${PIE_CHART_CONFIG.HEIGHT}`}
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
                          s.amount,
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
                        s.amount,
                      )} (${s.percent.toFixed(2)}%)`}</title>
                    </path>
                  </g>
                );
              })}
            </g>
          </svg>

          {/* moved total label below the chart to avoid overlap */}
          <div className="mt-2 flex justify-center items-center gap-1">
            <div className="text-sm">Tổng</div>
            <div className="text-sm font-bold">{fmtAmount(total)} VND</div>
          </div>
        </div>

        <div className="min-w-[140px]">
          {slices.length === 0 && (
            <div className="text-sm">Không có dữ liệu</div>
          )}
          <ul className="space-y-2">
            {slices.map((s, idx) => (
              <li
                key={s.category}
                onMouseEnter={() => setHoverIndex(idx)}
                onMouseLeave={() => setHoverIndex(null)}
                className={`flex items-center gap-2 p-2 rounded ${hoverIndex === idx ? "bg-gray-100 dark:bg-gray-600" : ""} cursor-pointer`}
              >
                <span
                  className="inline-block w-3 h-3 rounded-full"
                  style={{ backgroundColor: s.color }}
                />
                <div className="flex-1">
                  <div
                    className="text-sm font-medium"
                    style={{ color: s.color }}
                  >
                    {s.category}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
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

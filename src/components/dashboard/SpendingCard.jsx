import {
  RadialBarChart,
  RadialBar,
  ResponsiveContainer,
  PolarAngleAxis,
} from "recharts";

const SpendingCard = ({ current, limit, title }) => {
  const isOverLimit = current >= limit;

  const data = [
    {
      name: "Spending",
      value: current,
      fill: isOverLimit ? "#ef4444" : "#3b82f6",
    },
  ];

  const percent = Math.min((current / limit) * 100, 100);

  return (
    <div className="p-4 rounded border w-full max-w-sm">
      <h3 className="font-medium mb-2">{title}</h3>

      <div className="w-full h-[180px]">
        <ResponsiveContainer>
          <RadialBarChart
            data={data}
            innerRadius="70%"
            outerRadius="100%"
            startAngle={90}
            endAngle={-270}
          >
            {/* Quan trọng: domain = limit */}
            <PolarAngleAxis type="number" domain={[0, limit]} tick={false} />

            <RadialBar dataKey="value" cornerRadius={10} />

            {/* Percent text */}
            <text
              x="50%"
              y="50%"
              textAnchor="middle"
              dominantBaseline="middle"
              className="text-lg font-bold"
            >
              {percent.toFixed(0)}%
            </text>
          </RadialBarChart>
        </ResponsiveContainer>
      </div>

      <p className="text-sm text-gray-500">
        {current} / {limit}
      </p>

      <div className="mt-2 text-sm font-medium">
        {isOverLimit ? "Vượt giới hạn" : "Trong giới hạn"}
      </div>
    </div>
  );
};

export default SpendingCard;

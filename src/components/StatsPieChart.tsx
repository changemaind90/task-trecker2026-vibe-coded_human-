"use client";

import { Pie, PieChart, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const COLORS = ["#888", "#f59e0b", "#10b981"];

export default function StatsPieChart({
  todo,
  inProgress,
  done,
}: {
  todo: number;
  inProgress: number;
  done: number;
}) {
  const data = [
    { name: "TODO", value: todo, color: COLORS[0] },
    { name: "В работе", value: inProgress, color: COLORS[1] },
    { name: "Готово", value: done, color: COLORS[2] },
  ];

  return (
    <Card className="bg-transparent border-0 shadow-none backdrop-blur-0">
      <CardHeader>
        <CardTitle>Статусы задач</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={200}>
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              innerRadius={50}
              outerRadius={80}
              animationDuration={800}
              animationEasing="ease-in-out"
              style={{ outline: "none" }}
            >
              {data.map((entry, i) => (
                <Cell
                  key={i}
                  fill={entry.color}
                  style={{ outline: "none", cursor: "pointer" }}
                />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                background: "rgba(255,255,255,0.9)",
                border: "1px solid rgba(0,0,0,0.1)",
                borderRadius: 8,
                padding: "8px 12px",
              }}
              formatter={(value, name) => [
                `${value ?? 0} задач`,
                name as string,
              ]}
            />
          </PieChart>
        </ResponsiveContainer>

        <div className="flex justify-center gap-4 mt-3 flex-wrap">
          {data.map((entry) => (
            <div key={entry.name} className="flex items-center gap-1.5 text-sm">
              <span
                className="w-3 h-3 rounded-full inline-block"
                style={{ background: entry.color }}
              />
              <span>
                {entry.name}: <strong>{entry.value}</strong>
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

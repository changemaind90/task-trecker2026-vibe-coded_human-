"use client";

import { Pie, PieChart, Cell, ResponsiveContainer } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const COLORS = ["#888", "#f59e0b", "#10b981"];

export default function StatsPieChart({ todo, inProgress, done }: {
  todo: number; inProgress: number; done: number;
}) {
  const data = [
    { name: "TODO", value: todo },
    { name: "В работе", value: inProgress },
    { name: "Готово", value: done },
  ];

  return (
    <Card>
      <CardHeader><CardTitle>Статусы задач</CardTitle></CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={250}>
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              innerRadius={60}
              outerRadius={90}
              animationDuration={800}
              animationEasing="ease-in-out"
              label
            >
              {data.map((_, i) => (
                <Cell key={i} fill={COLORS[i]} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
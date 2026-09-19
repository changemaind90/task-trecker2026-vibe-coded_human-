"use client";

import { Pie, PieChart, Cell, ResponsiveContainer } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const COLORS = ["#888", "#f59e0b", "#10b981"];

export default function StatsPieChart({ todo, inProgress, done }: {
  todo: number; inProgress: number; done: number;
}) {
  const data = [
    { name: "TODO", value: todo, color: COLORS[0] },
    { name: "В работе", value: inProgress, color: COLORS[1] },
    { name: "Готово", value: done, color: COLORS[2] },
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
              animationDuration={1800}
              animationEasing="ease-in-out"
              label
            >{data.map((entry, i)=>(<Cell key={i} fill={COLORS[i]}/>))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        <div className="flex flex-wrap justify-center gap-[15px] mt-[10px]">
          {data.map((entry) => (
            <div key={entry.name} className="flex items-center gap-[6px] text-[13px]">
              <span className="inline-block w-3 h-3 rounded-full" style={{background: entry.color}}/>
              <span>{entry.name}: <strong>{entry.value}</strong></span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
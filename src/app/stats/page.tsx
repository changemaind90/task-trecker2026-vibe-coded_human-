"use client";

import { useMemo } from "react";
import { useTasks } from "@/hooks/useTasks";
import StatsPieChart from "@/components/StatsPieChart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function StatsPage() {
  const { tasks, isLoading } = useTasks();

  const stats = useMemo(() => {
    const done = tasks.filter(
      (t) => t.status === "DONE" && t.startedAt && t.completedAt,
    );
    const totalMs = done.reduce((acc, t) => {
      return (
        acc +
        (new Date(t.completedAt!).getTime() - new Date(t.startedAt!).getTime())
      );
    }, 0);
    const avgMs = done.length > 0 ? totalMs / done.length : 0;

    return {
      total: tasks.length,
      todo: tasks.filter((t) => t.status === "TODO").length,
      inProgress: tasks.filter((t) => t.status === "IN_PROGRESS").length,
      done: done.length,
      avgTime: avgMs,
      totalTime: totalMs,
    };
  }, [tasks]);

  if (isLoading) return <div className="p-8">Загрузка...</div>;

  return (
    <div className="w-full px-8 py-5">
      <h1 className="text-3xl font-bold mb-6 text-center">📊 Статистика</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Всего задач</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{stats.total}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Завершено</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-green-500">{stats.done}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Среднее время работы</CardTitle>
          </CardHeader>
        </Card>
      </div>

      <StatsPieChart
        todo={stats.todo}
        inProgress={stats.inProgress}
        done={stats.done}
      />
    </div>
  );
}

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Статистика — TaskTracker",
  description: "Аналитика задач и времени работы",
};

export default function StatsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

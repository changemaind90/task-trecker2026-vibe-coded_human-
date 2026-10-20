import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Мои задачи — TaskTracker",
  description: "Управляй своими задачами в TaskTracker",
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

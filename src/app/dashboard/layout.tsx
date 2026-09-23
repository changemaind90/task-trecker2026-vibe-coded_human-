import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Мои задачи — TaskFlow",
  description: "Управляй своими задачами в TaskFlow",
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

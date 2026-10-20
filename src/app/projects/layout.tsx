import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Проекты — TaskTracker",
  description: "Управляй своими проектами в TaskTracker",
};

export default function ProjectsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

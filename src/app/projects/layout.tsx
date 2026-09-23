import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Проекты — TaskFlow",
  description: "Управляй своими проектами в TaskFlow",
};

export default function ProjectsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

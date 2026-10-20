import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Регистрация — TaskTracker",
  description: "Создайте аккаунт в TaskTracker",
};

export default function RegisterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

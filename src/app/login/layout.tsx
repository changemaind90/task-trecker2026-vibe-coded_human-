import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Вход — TaskTracker",
  description: "Войдите в TaskTracker",
};

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

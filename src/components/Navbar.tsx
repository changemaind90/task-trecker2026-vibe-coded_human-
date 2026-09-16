/* "use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import ThemeToggle from "@/components/ThemeToggle";

export default function Navbar() {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };

  return (
    <nav style={{ display: "flex", alignItems: "center", gap: 20, padding: 15, borderBottom: "1px solid #ddd" }}>
      <ThemeToggle />
      <Link href="/dashboard">Задачи</Link>
      <Link href="/projects">Проекты</Link>
      <Button variant="outline" onClick={handleLogout}>Выйти</Button>
    </nav>
  );
} */


"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import ThemeToggle from "@/components/ThemeToggle";

export default function Navbar() {
  const router = useRouter();

  return (
    <nav style={{
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: "10px 20px",
      borderBottom: "1px solid var(--border)",
      marginBottom: 20,
    }}>
      <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
        <Button variant="outline" onClick={() => router.push("/dashboard")}>📋 Задачи</Button>
        <Button variant="outline" onClick={() => router.push("/projects")}>📁 Проекты</Button>
      </div>
      <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
        <ThemeToggle />
        <Button
          variant="outline"
          onClick={() => {
            localStorage.removeItem("token");
            router.push("/login");
          }}
        >
          Выйти
        </Button>
      </div>
    </nav>
  );
}
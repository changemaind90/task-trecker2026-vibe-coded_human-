"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function Navbar() {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };

  return (
    <nav style={{ display: "flex", gap: 20, padding: 15, borderBottom: "1px solid #ddd" }}>
      <Link href="/dashboard">Задачи</Link>
      <Link href="/projects">Проекты</Link>
      <Button variant="outline" onClick={handleLogout}>Выйти</Button>
    </nav>
  );
}
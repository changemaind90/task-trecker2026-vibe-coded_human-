"use client";

import Link from "next/link";

export default function Navbar() {

  return (
    <nav style={{ display: "flex", gap: 20, padding: 15, borderBottom: "1px solid #ddd" }}>
      <Link href="/dashboard">Задачи</Link>
      <Link href="/projects">Проекты</Link>
    </nav>
  );
}
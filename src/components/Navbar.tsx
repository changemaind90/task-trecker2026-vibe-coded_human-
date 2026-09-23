"use client";

import { usePathname } from "next/navigation";
import ThemeToggle from "@/components/ThemeToggle";
import NavButton from "./NavButton";

export default function Navbar() {
  const pathname = usePathname();
  if (pathname === "/" || pathname === "/login" || pathname === "/register") {
    return null;
  }

  return (
    <nav className="sticky top-0 z-50 grid grid-cols-3 items-center px-5 py-3 backdrop-blur-xl bg-white/60 dark:bg-black/40 border-b border-white/40 dark:border-white/10">
      {/* Левая часть */}
      <div className="flex items-center gap-2 justify-start">
        <NavButton label="На главную" icon="🏠" href="/" />
      </div>

      {/* Центральная часть */}
      <div className="flex items-center gap-2 justify-center">
        <NavButton label="Задачи" icon="📋" href="/dashboard" />
        <NavButton label="Проекты" icon="📁" href="/projects" />
      </div>

      {/* Правая часть */}
      <div className="flex items-center gap-2 justify-end">
        <ThemeToggle />
        <NavButton
          label="Выйти"
          icon="🚪"
          onClick={() => {
            localStorage.removeItem("token");
            window.location.href = "/login";
          }}
        />
      </div>
    </nav>
  );
}

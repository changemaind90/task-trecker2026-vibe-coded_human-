"use client";

import { useRouter, usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import ThemeToggle from "@/components/ThemeToggle";
import HomeButton from "./HomeButton";

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();

  if (pathname === "/" || pathname === "/login" || pathname === "/register") {
    return null;
  }

  return (
    <nav className="sticky top-0 z-50 grid grid-cols-3 items-center px-5 py-3 backdrop-blur-xl bg-white/60 dark:bg-black/40 border-b border-white/40 dark:border-white/10">
      {/* Левая часть */}
      <div className="flex items-center gap-2 justify-start">
        <HomeButton />
      </div>

      {/* Центральная часть */}
      <div className="flex items-center gap-2 justify-center">
        <Button
          variant="outline"
          className="cursor-pointer border border-border hover:bg-accent"
          onClick={() => router.push("/dashboard")}
        >
          📋 Задачи
        </Button>
        <Button
          variant="outline"
          className="cursor-pointer border border-border hover:bg-accent"
          onClick={() => router.push("/projects")}
        >
          📁 Проекты
        </Button>
      </div>

      {/* Правая часть */}
      <div className="flex items-center gap-2 justify-end">
        <ThemeToggle />
        <Button
          variant="outline"
          className="cursor-pointer border border-border hover:bg-accent"
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

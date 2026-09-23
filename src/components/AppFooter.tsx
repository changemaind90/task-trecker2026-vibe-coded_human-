"use client";

import { usePathname } from "next/navigation";

export default function AppFooter() {
  const pathname = usePathname();

  // Не показываем на лендинге и страницах авторизации
  if (pathname === "/" || pathname === "/login" || pathname === "/register") {
    return null;
  }

  return (
    <footer className="mt-12 border-t border-border/50 backdrop-blur-xl bg-white/40 dark:bg-black/20">
      <div className="max-w-6xl mx-auto px-8 py-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="text-xs text-muted-foreground text-center md:text-left">
          © 2026 TaskTracker · Есть вопрос или идея?
        </p>

        <div className="flex flex-wrap gap-3 justify-center">
          <a
            href="https://t.me/MyRiskyBot"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-border bg-white/40 dark:bg-white/5 backdrop-blur-md hover:bg-white/70 dark:hover:bg-white/10 text-xs font-medium transition-all cursor-pointer"
          >
            💬 Написать в бот
          </a>

          <a
            href="https://github.com/changemaind90/task-trecker2026-vibe-coded_human-/issues/new"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-border bg-white/40 dark:bg-white/5 backdrop-blur-md hover:bg-white/70 dark:hover:bg-white/10 text-xs font-medium transition-all cursor-pointer"
          >
            🐙 Создать issue
          </a>
        </div>
      </div>
    </footer>
  );
}

"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import ThemeToggle from "@/components/ThemeToggle";

export default function LandingPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) setIsLoggedIn(true);
  }, []);

  return (
    <div className="w-full">
      {/* HERO */}
      <section className="relative p-[80px_30px_60px] text-center">
        <div className="absolute top-5 right-5">
          <ThemeToggle />
        </div>
        <h1 className="text-[clamp(32px,6vw,64px)] font-bold mb-5 leading-[1.1]">
          TaskTracker — ваш <span style={{ color: "#6366f1" }}>умный</span>{" "}
          менеджер задач
        </h1>
        <p className="text-[clamp(16px,2vw,20px)] max-w-[700px] mx-auto mb-10 text-[var(--muted-foreground)]">
          Управляй задачами, проектами и приоритетами в одном месте. Фильтруй,
          сортируй, анализируй — и всё это в красивом интерфейсе с тёмной темой.
        </p>

        <div className="flex gap-3.75 justify-center flex-wrap">
          {isLoggedIn ? (
            <Link href="/dashboard">
              <Button
                size="lg"
                className="text-base px-8 py-3 cursor-pointer hover:scale-105 transition-transform"
              >
                🚀 Перейти к задачам
              </Button>
            </Link>
          ) : (
            <>
              <Link href="/register">
                <Button size="lg" className="text-base px-8 py-3">
                  🚀 Начать бесплатно
                </Button>
              </Link>
              <Link href="/login">
                <Button
                  size="lg"
                  variant="outline"
                  className="text-base px-8 py-3"
                >
                  Войти
                </Button>
              </Link>
            </>
          )}
        </div>
      </section>

      {/* FEATURES */}
      <section className="p-[60px_30px] max-w-[1200px] mx-auto">
        <h2 className="text-[clamp(24px,4vw,40px)] text-center mb-10">
          ✨ Что умеет TaskTracker
        </h2>

        <div className="grid grid-cols-[repeat(auto-fit,minmax(260px,1fr))] gap-5">
          <Card>
            <CardHeader>
              <CardTitle>📋 Задачи</CardTitle>
            </CardHeader>
            <CardContent>
              Создавай задачи с описанием, приоритетом, дедлайном и привязкой к
              проекту. Меняй статус в один клик.
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>📁 Проекты</CardTitle>
            </CardHeader>
            <CardContent>
              Группируй задачи по проектам. Смотри, сколько задач в каждом и
              сколько уже сделано.
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>📊 Статистика</CardTitle>
            </CardHeader>
            <CardContent>
              Красивая диаграмма показывает распределение задач по статусам:
              TODO, в работе, готово.
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>🔍 Фильтры и поиск</CardTitle>
            </CardHeader>
            <CardContent>
              Находи нужные задачи за секунду — фильтруй по статусу, приоритету,
              проекту и ищи по названию.
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>🌙 Тёмная тема</CardTitle>
            </CardHeader>
            <CardContent>
              Переключайся между светлой и тёмной темой — интерфейс
              подстраивается мгновенно.
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>🔐 Безопасность</CardTitle>
            </CardHeader>
            <CardContent>
              JWT-авторизация, bcrypt-хеширование паролей и защита API. Твои
              данные в безопасности.
            </CardContent>
          </Card>
        </div>
      </section>

      {/* SCREENSHOTS */}
      <section className="p-[60px_30px] max-w-[1200px] mx-auto">
        <h2 className="text-[clamp(24px,4vw,40px)] text-center mb-10">
          📸 Как это выглядит
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <img
            src="/screenshots/dashboard.png"
            alt="Дашборд"
            className="w-full rounded-[12px] border-[1px] border-solid border-[var(--border)]"
          />
          <img
            src="/screenshots/create-task.png"
            alt="Создание задачи"
            className="w-full rounded-[12px] border-[1px] border-solid border-[var(--border)]"
          />
          <img
            src="/screenshots/stats.png"
            alt="Статистика"
            className="w-full rounded-[12px] border-[1px] border-solid border-[var(--border)]"
          />
          <img
            src="/screenshots/dark-theme.png"
            alt="Тёмная тема"
            className="w-full rounded-[12px] border-[1px] border-solid border-[var(--border)]"
          />
        </div>
      </section>

      {/* TECH STACK */}
      <section className="p-[60px_30px] backdrop-blur-sm bg-white/20 dark:bg-white/5 border-y border-white/20 dark:border-white/10">
        <div className="max-w-[1200px] mx-auto">
          <h2 className="text-[clamp(24px,4vw,40px)] text-center mb-10">
            🛠️ Технологии
          </h2>

          <div className="flex flex-wrap gap-3 justify-center">
            {[
              "Next.js 16",
              "React 19",
              "TypeScript",
              "Tailwind CSS 4",
              "shadcn/ui",
              "React Query",
              "Zod",
              "Prisma 7",
              "PostgreSQL",
              "Neon",
              "JWT + bcrypt",
              "sonner",
              "framer-motion",
              "Vitest",
              "GitHub Actions",
              "Docker",
              "Vercel",
              "Telegram Bot",
            ].map((tech) => (
              <span
                key={tech}
                className="p-[8px_16px]  bg-[var(--background)] border-[1px] border-solid border-[var(--border)] 
                    rounded-[20px] text-[14px] font-medium"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="p-[80px_30px] text-center">
        <h2 className="text-[clamp(24px,4vw,40px)] mb-5">
          Готов навести порядок в задачах? 🎯
        </h2>
        <p className="text-[18px] text-[var(--muted-foreground)] mb-7.5">
          Регистрация занимает 10 секунд. Бесплатно. Без карты.
        </p>

        {isLoggedIn ? (
          <Link href="/dashboard">
            <Button
              size="lg"
              className="text-base px-8 py-3 cursor-pointer hover:scale-105 transition-transform"
            >
              🚀 Перейти к задачам
            </Button>
          </Link>
        ) : (
          <Link href="/register">
            <Button
              size="lg"
              className="text-base px-8 py-3 cursor-pointer hover:scale-105 transition-transform"
            >
              Создать аккаунт
            </Button>
          </Link>
        )}
      </section>

      {/* FOOTER */}
      <footer className="mt-20 border-t border-border/50 backdrop-blur-xl bg-white/40 dark:bg-black/20">
        <div className="max-w-6xl mx-auto px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            {/* Левая — бренд */}
            <div>
              <a
                href="#"
                className="text-2xl font-bold bg-gradient-to-r from-indigo-500 to-pink-500 bg-clip-text text-transparent"
              >
                TaskTracker
              </a>
              <p className="text-sm text-muted-foreground mt-3">
                Умный менеджер задач для продуктивных людей
              </p>
            </div>

            {/* Центр — навигация */}
            <div>
              <h4 className="font-semibold mb-3">Навигация</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <a
                    href="#"
                    className="hover:text-foreground transition-colors"
                  >
                    Наверх
                  </a>
                </li>
                <li>
                  <a
                    href="/login"
                    className="hover:text-foreground transition-colors"
                  >
                    Войти
                  </a>
                </li>
                <li>
                  <a
                    href="/register"
                    className="hover:text-foreground transition-colors"
                  >
                    Регистрация
                  </a>
                </li>
              </ul>
            </div>

            {/* Правая — контакты */}
            <div>
              <h4 className="font-semibold mb-3">Контакты</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a
                    href="https://t.me/Roman_4udo"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <span className="text-lg">💬</span> Telegram: @Roman_4udo
                  </a>
                </li>
                <li>
                  <a
                    href="https://github.com/changemaind90"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <span className="text-lg">🐙</span> GitHub: changemaind90
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="pt-6 border-t border-border/50 text-center text-xs text-muted-foreground">
            © 2026 TaskTracker · Сделано с ❤️ на Next.js
          </div>
        </div>
      </footer>
    </div>
  );
}

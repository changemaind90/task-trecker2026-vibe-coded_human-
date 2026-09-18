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
      <section className="p-[80px_30px_60px] text-center bg-[linear-gradient(135deg,var(--background)_0%,var(--muted)_100%)]">
        <div className="absolute top-5 right-5">
          <ThemeToggle />
        </div>
        <h1 className="text-[clamp(32px,6vw,64px)] font-bold mb-5 leading-[1.1]">
          TaskFlow — твой <span style={{ color: "#6366f1" }}>умный</span> менеджер задач
        </h1>
        <p className="text-[clamp(16px,2vw,20px)] max-w-[700px] mx-auto mb-10 text-[var(--muted-foreground)]">
          Управляй задачами, проектами и приоритетами в одном месте. Фильтруй, сортируй, анализируй — и всё это в красивом интерфейсе с тёмной темой.
        </p>

        <div className="flex gap-3.75 justify-center flex-wrap">
          {isLoggedIn ? (
            <Link href="/dashboard">
              <Button size="lg" className="text-base px-8 py-3">
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
                <Button size="lg" variant="outline" className="text-base px-8 py-3">
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
          ✨ Что умеет TaskFlow
        </h2>

        <div className="grid grid-cols-[repeat(auto-fit,minmax(260px,1fr))] gap-5">
          <Card>
            <CardHeader>
              <CardTitle>📋 Задачи</CardTitle>
            </CardHeader>
            <CardContent>
              Создавай задачи с описанием, приоритетом, дедлайном и привязкой к проекту. Меняй статус в один клик.
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>📁 Проекты</CardTitle>
            </CardHeader>
            <CardContent>
              Группируй задачи по проектам. Смотри, сколько задач в каждом и сколько уже сделано.
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>📊 Статистика</CardTitle>
            </CardHeader>
            <CardContent>
              Красивая диаграмма показывает распределение задач по статусам: TODO, в работе, готово.
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>🔍 Фильтры и поиск</CardTitle>
            </CardHeader>
            <CardContent>
              Находи нужные задачи за секунду — фильтруй по статусу, приоритету, проекту и ищи по названию.
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>🌙 Тёмная тема</CardTitle>
            </CardHeader>
            <CardContent>
              Переключайся между светлой и тёмной темой — интерфейс подстраивается мгновенно.
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>🔐 Безопасность</CardTitle>
            </CardHeader>
            <CardContent>
              JWT-авторизация, bcrypt-хеширование паролей и защита API. Твои данные в безопасности.
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="p-[60px_30px] max-w-[1200px] mx-auto">
        <h2 className="text-[clamp(24px,4vw,40px)] text-center mb-10">
          📸 Как это выглядит
        </h2>
        <div className="grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-5">
          <img src="/screenshots/dashboard.png" alt="Дашборд" className="w-full rounded-[12px] border-[1px] border-solid border-[var(--border)]"/>
          <img src="/screenshots/create-task.png" alt="Создание задачи" className="w-full rounded-[12px] border-[1px] border-solid border-[var(--border)]"/>
          <img src="/screenshots/stats.png" alt="Статистика" className="w-full rounded-[12px] border-[1px] border-solid border-[var(--border)]"/>
          <img src="/screenshots/dark-theme.png" alt="Тёмная тема" className="w-full rounded-[12px] border-[1px] border-solid border-[var(--border)]"/>
        </div>
      </section>

      {/* TECH STACK */}
      <section className="p-[60px_30px] bg-[var(--muted)]">
        <div className="max-w-[1200px] mx-auto">
          <h2 className="text-[clamp(24px,4vw,40px)] text-center mb-10">
            🛠️ Технологии
          </h2>

          <div className="flex flex-wrap gap-3 justify-center">
            {[
              "Next.js 16", "TypeScript", "PostgreSQL", "Prisma 7",
              "Tailwind CSS", "shadcn/ui", "JWT + bcrypt", "Vercel",
              "Docker", "Recharts", "Zod", "Telegram Bot"
            ].map((tech) => (
              <span key={tech}
              className="p-[8px_16px]  bg-[var(--background)] border-[1px] border-solid border-[var(--border)] rounded-[20px] text-[14px] font-medium"
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

        {!isLoggedIn && (
          <Link href="/register">
            <Button size="lg" className="text-base px-8 py-3">
              Создать аккаунт
            </Button>
          </Link>
        )}
      </section>

      {/* FOOTER */}
      <footer > <p> TaskFlow © 2026 · Сделано с ❤️ на Next.js ·{" "}
          <a href="https://github.com/changemaind90/task-trecker2026-vibe-coded_human-"
            target="_blank" rel="noopener noreferrer" className="text-[#6366f1] underline"
          >
            GitHub
          </a>
        </p>
      </footer>
    </div>
  );
}
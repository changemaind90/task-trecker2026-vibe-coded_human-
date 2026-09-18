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
      <section style={{
        padding: "80px 30px 60px",
        textAlign: "center",
        background: "linear-gradient(135deg, var(--background) 0%, var(--muted) 100%)",
      }}>
        <div style={{ position: "absolute", top: 20, right: 20 }}>
          <ThemeToggle />
        </div>
        <h1 style={{ fontSize: "clamp(32px, 6vw, 64px)", fontWeight: 800, marginBottom: 20, lineHeight: 1.1 }}>
          TaskFlow — твой <span style={{ color: "#6366f1" }}>умный</span> менеджер задач
        </h1>
        <p style={{ fontSize: "clamp(16px, 2vw, 20px)", maxWidth: 700, margin: "0 auto 40px", color: "var(--muted-foreground)" }}>
          Управляй задачами, проектами и приоритетами в одном месте. Фильтруй, сортируй, анализируй — и всё это в красивом интерфейсе с тёмной темой.
        </p>

        <div style={{ display: "flex", gap: 15, justifyContent: "center", flexWrap: "wrap" }}>
          {isLoggedIn ? (
            <Link href="/dashboard">
              <Button size="lg" style={{ fontSize: 16, padding: "12px 32px" }}>
                🚀 Перейти к задачам
              </Button>
            </Link>
          ) : (
            <>
              <Link href="/register">
                <Button size="lg" style={{ fontSize: 16, padding: "12px 32px" }}>
                  🚀 Начать бесплатно
                </Button>
              </Link>
              <Link href="/login">
                <Button size="lg" variant="outline" style={{ fontSize: 16, padding: "12px 32px" }}>
                  Войти
                </Button>
              </Link>
            </>
          )}
        </div>
      </section>

      {/* FEATURES */}
      <section style={{ padding: "60px 30px", maxWidth: 1200, margin: "0 auto" }}>
        <h2 style={{ fontSize: "clamp(24px, 4vw, 40px)", textAlign: "center", marginBottom: 40 }}>
          ✨ Что умеет TaskFlow
        </h2>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 20 }}>
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

      <section style={{ padding: "60px 30px", maxWidth: 1200, margin: "0 auto" }}>
        <h2 style={{ fontSize: "clamp(24px, 4vw, 40px)", textAlign: "center", marginBottom: 40 }}>
          📸 Как это выглядит
        </h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 20 }}>
          <img src="/screenshots/dashboard.png" alt="Дашборд" style={{ width: "100%", borderRadius: 12, border: "1px solid var(--border)" }} />
          <img src="/screenshots/create-task.png" alt="Создание задачи" style={{ width: "100%", borderRadius: 12, border: "1px solid var(--border)" }} />
          <img src="/screenshots/stats.png" alt="Статистика" style={{ width: "100%", borderRadius: 12, border: "1px solid var(--border)" }} />
          <img src="/screenshots/dark-theme.png" alt="Тёмная тема" style={{ width: "100%", borderRadius: 12, border: "1px solid var(--border)" }} />
        </div>
      </section>

      {/* TECH STACK */}
      <section style={{ padding: "60px 30px", background: "var(--muted)" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <h2 style={{ fontSize: "clamp(24px, 4vw, 40px)", textAlign: "center", marginBottom: 40 }}>
            🛠️ Технологии
          </h2>

          <div style={{ display: "flex", flexWrap: "wrap", gap: 12, justifyContent: "center" }}>
            {[
              "Next.js 16", "TypeScript", "PostgreSQL", "Prisma 7",
              "Tailwind CSS", "shadcn/ui", "JWT + bcrypt", "Vercel",
              "Docker", "Recharts", "Zod", "Telegram Bot"
            ].map((tech) => (
              <span
                key={tech}
                style={{
                  padding: "8px 16px",
                  background: "var(--background)",
                  border: "1px solid var(--border)",
                  borderRadius: 20,
                  fontSize: 14,
                  fontWeight: 500,
                }}
              >
                {tech}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: "80px 30px", textAlign: "center" }}>
        <h2 style={{ fontSize: "clamp(24px, 4vw, 40px)", marginBottom: 20 }}>
          Готов навести порядок в задачах? 🎯
        </h2>
        <p style={{ fontSize: 18, color: "var(--muted-foreground)", marginBottom: 30 }}>
          Регистрация занимает 10 секунд. Бесплатно. Без карты.
        </p>

        {!isLoggedIn && (
          <Link href="/register">
            <Button size="lg" style={{ fontSize: 16, padding: "12px 32px" }}>
              Создать аккаунт
            </Button>
          </Link>
        )}
      </section>

      {/* FOOTER */}
      <footer style={{
        padding: "30px",
        textAlign: "center",
        borderTop: "1px solid var(--border)",
        fontSize: 14,
        color: "var(--muted-foreground)",
      }}>
        <p>
          TaskFlow © 2026 · Сделано с ❤️ на Next.js ·{" "}
          <a
            href="https://github.com/changemaind90/task-trecker2026-vibe-coded_human-"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: "#6366f1", textDecoration: "underline" }}
          >
            GitHub
          </a>
        </p>
      </footer>
    </div>
  );
}
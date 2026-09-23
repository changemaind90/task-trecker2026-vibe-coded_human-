"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import NavButton from "@/components/NavButton";
import AuthButton from "@/components/AuthButton";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Ошибка входа");
        return;
      }

      localStorage.setItem("token", data.token);
      document.cookie = `token=${data.token}; path=/; max-age=604800`; // 7 дней

      router.push("/dashboard");
    } catch (err) {
      setError("Ошибка соединения с сервером");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-[400px] mx-auto my-[50px]">
      <div style={{ marginBottom: 20 }}>
        <NavButton label="На главную" icon="🏠" href="/" />
      </div>
      <h1 className="text-2xl font-bold text-center mb-3">Вход</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full rounded-lg border border-border bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#6366f1]"
        />
        <input
          type="password"
          placeholder="Пароль"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full rounded-lg border border-border bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#6366f1]"
          required
        />
        <AuthButton loading={loading} loadingText="Вход..." text="Войти" />
        {error && <p className="text-red-500">{error}</p>}
      </form>
      <div className="text-sm text-center text-muted-foreground mt-2">
        Нет аккаунта?{" "}
        <Link
          href="/register"
          className="text-[#6366f1] font-medium hover:text-[#4f46ba] hover:underline transition-colors"
        >
          Зарегистрироваться
        </Link>
      </div>
    </div>
  );
}

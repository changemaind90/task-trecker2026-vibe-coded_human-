"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import HomeButton from "@/components/HomeButton";

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
        <HomeButton />
      </div>
      <h1 className="text-center mb-1">Вход</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="border-[1px] border-solid"
        />
        <input
          type="password"
          placeholder="Пароль"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border-[1px] border-solid"
          required
        />
        <button
          type="submit"
          disabled={loading}
          className="mb-2 group relative w-full flex items-center justify-center rounded-lg bg-[#6366f1] px-1 py-1 
            text-sm font-medium text-white shadow-md hover:bg-[#4f46ba] active:scale-[0.99] 
            transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed disabled:shadow-none"
        >
          {" "}
          {loading ? (
            <>
              <span className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"></span>
              Вход...
            </>
          ) : (
            "Войти"
          )}
        </button>
        {error && <p className="text-red-500">{error}</p>}
      </form>
      <p className="text-sm text-[var(--muted-foreground)]">
        Нет аккаунта?
        <Link
          href="/register"
          className="text-[#6366f1] underline hover:text-[#4f46ba]"
        >
          Зарегистрироваться
        </Link>
      </p>
    </div>
  );
}

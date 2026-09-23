"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  return (
    <Button
      variant="outline"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="cursor-pointer border border-border hover:bg-accent rounded-full w-16 h-16 p-0 text-xl"
    >
      {theme === "dark" ? "☀️" : "🌙"}
    </Button>
  );
}

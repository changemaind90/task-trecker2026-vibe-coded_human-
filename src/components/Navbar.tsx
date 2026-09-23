
  "use client";

  import { useRouter, usePathname } from "next/navigation";
  import { Button } from "@/components/ui/button";
  import ThemeToggle from "@/components/ThemeToggle";
  import HomeButton from "./HomeButton";

  export default function Navbar() {
    const router = useRouter();
    const pathname = usePathname();

    if (pathname === "/" || pathname === "/login" || pathname === "/register"){return null;}

    return (
      <nav className="sticky top-0 z-50 flex items-center justify-between 
                      px-5 py-3 backdrop-blur-xl bg-white/60 dark:bg-black/40 border-b border-white/40 
                      dark:border-white/10">
        <div className="flex items-center gap-[10px]">
          <HomeButton />
          <Button variant="outline" onClick={() => router.push("/dashboard")}>📋 Задачи</Button>
          <Button variant="outline" onClick={() => router.push("/projects")}>📁 Проекты</Button>
        </div>
        <div className="flex items-center gap-[10px]">
          <ThemeToggle />
          <Button variant="outline" onClick={() =>{localStorage.removeItem("token");router.push("/login");}}>Выйти</Button>
        </div>
      </nav>
    );
  }
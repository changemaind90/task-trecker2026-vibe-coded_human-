// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyToken } from "@/lib/auth";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value || request.headers.get("authorization")?.split(" ")[1];
  const isAuthPage = request.nextUrl.pathname.startsWith("/login");
  const isDashboard = request.nextUrl.pathname.startsWith("/dashboard");
  const isApi = request.nextUrl.pathname.startsWith("/api");

  // Если пользователь на странице входа и уже авторизован — редирект на дашборд
  if (isAuthPage && token && verifyToken(token)) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // Защищаем дашборд и API (кроме /api/auth)
  if ((isDashboard || (isApi && !request.nextUrl.pathname.startsWith("/api/auth"))) && !token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/projects/:path*", "/api/tasks/:path*", "/login"],
};
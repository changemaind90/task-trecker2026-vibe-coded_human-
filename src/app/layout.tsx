import type { Metadata } from "next";
import { ThemeProvider } from "next-themes";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Providers from "@/components/Providers";
import { Inter, JetBrains_Mono } from "next/font/google";
import AppFooter from "@/components/AppFooter";
import { Toaster } from "@/components/ui/sonner";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin", "cyrillic"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  display: "swap",
});
export const metadata: Metadata = {
  title: "TaskTracker — Менеджер задач",
  description: "(Пет-проект) Управляй задачами и проектами",
  openGraph: {
    title: "TaskTracker — Менеджер задач",
    description: "(Пет-проект) Управляй задачами и проектами",
    url: "https://task-trecker2026-vibe-human.vercel.app",
    siteName: "TaskTracker",
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 629,
        alt: "TaskTracker — менеджер задач",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 629,
        alt: "TaskTracker — менеджер задач",
      },
    ],
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="ru"
      suppressHydrationWarning
      className={`${inter.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          storageKey="taskflow-theme"
          disableTransitionOnChange
        >
          <Providers>
            <Navbar />
            <main className="animate-page-in flex-1">{children}</main>
            <AppFooter />
            <Toaster />
          </Providers>
        </ThemeProvider>
      </body>
    </html>
  );
}

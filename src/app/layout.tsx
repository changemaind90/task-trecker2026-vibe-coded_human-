import type { Metadata } from "next";
import { ThemeProvider } from "next-themes";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Providers from "@/components/Providers";
import { Inter, JetBrains_Mono } from "next/font/google";

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
    images: ["/og-image.png"],
    type: "website",
  },
   twitter: {
    card: "summary_large_image",
    images: ["/og-image.png"],
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ru" suppressHydrationWarning className={`${inter.variable} ${jetbrainsMono.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem storageKey="taskflow-theme" disableTransitionOnChange >
          <Providers>
          <Navbar/> 
          <main className="animate-page-in flex-1">
            {children}
          </main>
          </Providers>
        </ThemeProvider>
        </body>
    </html>
  );
}

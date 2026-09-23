import type { Metadata } from "next";
import { ThemeProvider } from "next-themes";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Providers from "@/components/Providers";

const geistSans = Geist({ variable: "--font-geist-sans",subsets: ["latin"], });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"], });
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
    <html lang="ru" suppressHydrationWarning className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
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

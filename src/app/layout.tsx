import type { Metadata } from "next";
import { Inter, Geist_Mono } from "next/font/google";
import "./globals.css";
import { TaskmindProvider } from "./providers";
import { Header } from "./components/Header";

const interSans = Inter({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "TaskMind",
  description: "Organize tarefas, hábitos e seu dia em um só lugar.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body
        className={`${interSans.variable} ${geistMono.variable} antialiased bg-slate-950 text-slate-50`}
      >
        <TaskmindProvider>
          <div className="flex min-h-screen flex-col">
            <Header />
            <main className="mx-auto flex w-full max-w-5xl flex-1 px-4 py-6">
              {children}
            </main>
          </div>
        </TaskmindProvider>
      </body>
    </html>
  );
}


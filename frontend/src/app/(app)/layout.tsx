'use client';

import { TaskmindProvider } from "../providers";
import { Header } from "../components/Header";
import { PageTransition } from "../components/PageTransition";

export default function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <TaskmindProvider>
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="mx-auto flex w-full max-w-5xl flex-1 px-4 py-6">
          <PageTransition>{children}</PageTransition>
        </main>
      </div>
    </TaskmindProvider>
  );
}

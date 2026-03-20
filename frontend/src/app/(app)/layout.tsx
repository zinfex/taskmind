import { TaskmindProvider } from "../providers";
import { Header } from "../components/Header";
import { PageTransition } from "../components/PageTransition";
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

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

import { SessionManager } from '@/features/session/SessionManager'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export default async function Home() {
  const supabase = await createClient()

  // Check auth on the server
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const userName = user.email?.split('@')[0] || 'User'

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors">
      <div className="max-w-4xl mx-auto px-4 py-12 sm:py-20 space-y-16">
        {/* Header Section */}
        <header className="text-center space-y-4">
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
            MoyaMoya
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-lg mx-auto leading-relaxed">
            ようこそ {userName} さん。<br />
            頭の中の「モヤモヤ」を書き出して、<br className="hidden sm:inline" />明確な「言葉」に変える5分間のトレーニング。
          </p>
        </header>



        {/* Main Content */}
        <section>
          <SessionManager />
        </section>
      </div>
    </main>
  )
}

import { HistoryList } from '@/features/history/HistoryList'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export default function HistoryPage() {
    return (
        <main className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors">
            <div className="max-w-4xl mx-auto px-4 py-8 sm:py-12 space-y-8">
                <header className="flex items-center gap-4">
                    <Link
                        href="/"
                        className="p-2 rounded-xl text-slate-500 hover:bg-white hover:text-indigo-600 transition-all"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </Link>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                        モヤモヤまとめ履歴
                    </h1>
                </header>

                <section>
                    <HistoryList />
                </section>
            </div>
        </main>
    )
}

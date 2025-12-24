'use client'

import { useState } from 'react'
import { MemoInput } from './MemoInput'
import { MemoList } from './MemoList'
import Link from 'next/link'
import { History, ArrowRight } from 'lucide-react'

import { Memo } from './MemoService'

export function MemoContainer({ onMemoSelect }: { onMemoSelect?: (memo: Memo) => void }) {
    const [refreshKey, setRefreshKey] = useState(0)

    const handleMemoCreated = () => {
        setRefreshKey(prev => prev + 1)
    }

    return (
        <div className="space-y-12 sm:space-y-20">
            <section>
                <MemoInput onMemoCreated={handleMemoCreated} />
            </section>

            <div className="flex justify-center">
                <Link href="/history" className="group relative inline-flex items-center gap-2 px-8 py-3 bg-white dark:bg-slate-900 rounded-full text-slate-700 dark:text-slate-200 font-bold shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all border border-slate-100 dark:border-slate-800 ring-1 ring-slate-900/5 dark:ring-slate-50/10">
                    <span className="bg-indigo-100 dark:bg-indigo-900/50 p-1.5 rounded-full text-indigo-600 dark:text-indigo-400 group-hover:scale-110 transition-transform">
                        <History className="w-4 h-4" />
                    </span>
                    モヤモヤまとめ履歴を見る
                    <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
                </Link>
            </div>

            <section>
                <MemoList refreshKey={refreshKey} onMemoSelect={onMemoSelect} />
            </section>
        </div>
    )
}

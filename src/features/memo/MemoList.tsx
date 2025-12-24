'use client'

import { useEffect, useState } from 'react'
import { Memo, MemoService } from './MemoService'
import { motion, AnimatePresence } from 'framer-motion'
import { Calendar, Clock, ArrowRight } from 'lucide-react'
import { format } from 'date-fns'
import { ja } from 'date-fns/locale'

export function MemoList({ refreshKey, onMemoSelect }: { refreshKey: number; onMemoSelect?: (memo: Memo) => void }) {
    const [memos, setMemos] = useState<Memo[]>([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const fetchMemos = async () => {
            try {
                const data = await MemoService.fetchMemos()
                setMemos(data)
            } catch (error) {
                console.error('Failed to fetch memos:', error)
            } finally {
                setIsLoading(false)
            }
        }

        fetchMemos()
    }, [refreshKey])

    if (isLoading) {
        return (
            <div className="flex justify-center py-12">
                <div className="w-6 h-6 border-2 border-slate-200 border-t-slate-800 rounded-full animate-spin" />
            </div>
        )
    }

    if (memos.length === 0) {
        return (
            <div className="text-center py-12 text-slate-500">
                <p>まだメモがありません。<br />今の気持ちを書き出してみましょう。</p>
            </div>
        )
    }

    return (
        <div className="space-y-4 max-w-2xl mx-auto px-4">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <Clock className="w-5 h-5 text-indigo-500" />
                最近のモヤモヤ
            </h2>
            <div className="grid gap-4">
                <AnimatePresence mode="popLayout">
                    {memos.map((memo) => (
                        <motion.div
                            key={memo.id}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            layout
                            className="group relative bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 hover:shadow-lg hover:border-indigo-500/20 transition-all cursor-pointer"
                            onClick={() => onMemoSelect?.(memo)}
                        >
                            <div className="flex items-start justify-between gap-4">
                                <div className="space-y-3 flex-1 min-w-0">
                                    <p className="text-slate-700 dark:text-slate-300 text-lg leading-relaxed line-clamp-2">
                                        {memo.content}
                                    </p>
                                    <div className="flex items-center gap-3 text-sm text-slate-400">
                                        <div className="flex items-center gap-1">
                                            <Calendar className="w-3.5 h-3.5" />
                                            <time dateTime={memo.created_at}>
                                                {format(new Date(memo.created_at), 'M月d日(EEE) HH:mm', { locale: ja })}
                                            </time>
                                        </div>
                                    </div>
                                </div>
                                <div className="hidden sm:flex items-center gap-3">
                                    <span className="text-sm font-bold text-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity">
                                        3分間で深掘りする
                                    </span>
                                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-slate-50 dark:bg-slate-800 text-slate-400 group-hover:bg-indigo-50 dark:group-hover:bg-indigo-950/30 group-hover:text-indigo-500 transition-colors">
                                        <ArrowRight className="w-5 h-5" />
                                    </div>
                                </div>
                            </div>
                            {/* Mobile only action text */}
                            <div className="mt-4 sm:hidden pt-4 border-t border-slate-100 dark:border-slate-800">
                                <p className="text-sm font-bold text-indigo-600 dark:text-indigo-400 flex items-center justify-end gap-1">
                                    3分間で深掘りする <ArrowRight className="w-4 h-4" />
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>
        </div>
    )
}

'use client'

import { useEffect, useState } from 'react'
import { Session, SessionService } from '../session/SessionService'
import { motion } from 'framer-motion'
import { Calendar, ArrowRight, CheckCircle2, ChevronDown } from 'lucide-react'
import Link from 'next/link'

type HistorySession = Session & {
    memo: { content: string } | null
    reasons: { content: string }[]
}

export function HistoryList() {
    const [sessions, setSessions] = useState<HistorySession[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [expandedReasons, setExpandedReasons] = useState<Set<string>>(new Set())

    const toggleReasons = (sessionId: string) => {
        setExpandedReasons(prev => {
            const next = new Set(prev)
            if (next.has(sessionId)) {
                next.delete(sessionId)
            } else {
                next.add(sessionId)
            }
            return next
        })
    }

    useEffect(() => {
        const loadHistory = async () => {
            try {
                const data = await SessionService.fetchHistory()
                setSessions(data)
            } catch (error) {
                console.error('Failed to load history:', error)
            } finally {
                setIsLoading(false)
            }
        }
        loadHistory()
    }, [])

    if (isLoading) {
        return <div className="p-8 text-center text-slate-500">読み込み中...</div>
    }

    if (sessions.length === 0) {
        return (
            <div className="text-center py-20 px-4">
                <p className="text-slate-500 mb-4">まだ履歴がありません。</p>
                <Link href="/" className="text-indigo-600 font-medium hover:underline">
                    トレーニングを始める
                </Link>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            {sessions.map((session, index) => (
                <motion.div
                    key={session.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-800"
                >
                    <div className="flex items-center gap-2 text-sm text-slate-400 mb-4">
                        <Calendar className="w-4 h-4" />
                        <time>{new Date(session.created_at).toLocaleDateString('ja-JP')}</time>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8 relative">
                        {/* Connecting Arrow for Desktop */}
                        <div className="hidden md:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 justify-center items-center w-8 h-8 rounded-full bg-slate-50 dark:bg-slate-800 text-slate-300">
                            <ArrowRight className="w-4 h-4" />
                        </div>

                        {/* Before: Memo */}
                        <div className="space-y-2">
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">モヤモヤ</p>
                            <p className="text-lg text-slate-600 dark:text-slate-300 font-medium leading-relaxed">
                                {session.memo?.content}
                            </p>

                            {/* Reasons - Collapsible */}
                            {session.reasons && session.reasons.length > 0 && (
                                <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                                    <button
                                        onClick={() => toggleReasons(session.id)}
                                        className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider hover:text-slate-600 dark:hover:text-slate-300 transition-colors w-full text-left"
                                    >
                                        <ChevronDown className={`w-4 h-4 transition-transform ${expandedReasons.has(session.id) ? 'rotate-180' : ''}`} />
                                        深掘りした理由 ({session.reasons.length}件)
                                    </button>
                                    {expandedReasons.has(session.id) && (
                                        <ul className="space-y-1 mt-2">
                                            {session.reasons.map((reason, i) => (
                                                <li key={i} className="text-sm text-slate-500 dark:text-slate-400 flex items-start gap-2">
                                                    <span className="block w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-600 mt-2 shrink-0" />
                                                    {reason.content}
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* After: Conclusion */}
                        <div className="space-y-2 md:pl-8">
                            <p className="text-xs font-bold text-indigo-500 uppercase tracking-wider flex items-center gap-1">
                                <CheckCircle2 className="w-3 h-3" />
                                モヤモヤ結論
                            </p>
                            <p className="text-xl text-slate-900 dark:text-slate-100 font-bold leading-relaxed mb-4">
                                {session.conclusion}
                            </p>

                            {session.keywords && (
                                <div className="flex flex-wrap gap-2 mb-4">
                                    {session.keywords.split(',').map((keyword, i) => (
                                        <span key={i} className="px-2 py-1 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 text-xs font-semibold rounded-md border border-indigo-100 dark:border-indigo-800">
                                            #{keyword.trim()}
                                        </span>
                                    ))}
                                </div>
                            )}
                            {session.next_action && (
                                <div className="mt-4 pt-4 border-t border-dashed border-slate-200 dark:border-slate-800">
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1 mb-2">
                                        <ArrowRight className="w-3 h-3" />
                                        その後やること
                                    </p>
                                    <p className="text-base text-slate-700 dark:text-slate-300 font-medium">
                                        {session.next_action}
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </motion.div>
            ))}
        </div>
    )
}

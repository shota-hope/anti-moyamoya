'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Send, ArrowRight, CheckCircle2 } from 'lucide-react'

export function SummarizingPhase({
    reasons,
    memoContent,
    onComplete,
    onCancel
}: {
    reasons: string[]
    memoContent: string
    onComplete: (keywords: string, conclusion: string, nextAction: string) => void
    onCancel: () => void
}) {
    const [keywords, setKeywords] = useState('')
    const [conclusion, setConclusion] = useState('')
    const [nextAction, setNextAction] = useState('')
    const [isSubmitting, setIsSubmitting] = useState(false)

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (!conclusion.trim() || isSubmitting) return

        setIsSubmitting(true)
        onComplete(keywords, conclusion, nextAction)
    }

    return (
        <div className="max-w-2xl mx-auto space-y-8 p-4">
            {/* Header */}
            <header className="text-center space-y-4">
                <div className="space-y-2">
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                        モヤモヤを言葉にまとめる
                    </h2>
                    <p className="text-slate-500">
                        出し切った理由を眺めて、浮かび上がってきたキーワードや結論を書き留めましょう。
                    </p>
                </div>

                <div className="bg-indigo-50 dark:bg-indigo-900/20 p-4 rounded-xl border border-indigo-100 dark:border-indigo-800/50 inline-block max-w-lg">
                    <p className="text-sm text-indigo-600 dark:text-indigo-400 font-bold mb-1">
                        対象の出来事
                    </p>
                    <p className="text-lg font-bold text-slate-900 dark:text-slate-100">
                        「{memoContent}」
                    </p>
                </div>
            </header>

            {/* Reasons Review */}
            <div className="bg-slate-50 dark:bg-slate-900/50 p-6 rounded-2xl border border-slate-100 dark:border-slate-800">
                <p className="text-sm font-medium text-slate-500 mb-4 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-indigo-500" />
                    書き出した理由
                </p>
                <div className="flex flex-wrap gap-2">
                    {reasons.map((reason, i) => (
                        <span key={i} className="inline-block px-3 py-1.5 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-sm">
                            {reason}
                        </span>
                    ))}
                </div>
            </div>

            {/* Input Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                        気になったキーワード（カンマ区切りなどで自由に）
                    </label>
                    <input
                        type="text"
                        value={keywords}
                        onChange={(e) => setKeywords(e.target.value)}
                        placeholder="例: 不安, 時間がない, 優先順位..."
                        className="w-full px-4 py-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                    />
                </div>

                <div className="space-y-2">
                    <label className="block text-sm font-medium text-slate-900 dark:text-slate-100">
                        結論（1行でまとめる）
                    </label>
                    <input
                        type="text"
                        value={conclusion}
                        onChange={(e) => setConclusion(e.target.value)}
                        placeholder="つまり、どういうこと？"
                        className="w-full px-4 py-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-lg font-medium transition-all"
                        required
                    />
                </div>

                <div className="space-y-2">
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                        次のアクション（任意）
                    </label>
                    <div className="relative">
                        <input
                            type="text"
                            value={nextAction}
                            onChange={(e) => setNextAction(e.target.value)}
                            placeholder="まずは何をしますか？"
                            className="w-full px-4 py-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all pl-10"
                        />
                        <ArrowRight className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    </div>
                </div>

                <div className="pt-4 flex gap-4">
                    <button
                        type="button"
                        onClick={onCancel}
                        className="flex-1 py-3 px-6 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 font-medium hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors"
                        disabled={isSubmitting}
                    >
                        中断する
                    </button>
                    <button
                        type="submit"
                        disabled={!conclusion.trim() || isSubmitting}
                        className="flex-[2] py-3 px-6 rounded-xl bg-indigo-600 text-white font-bold shadow-lg shadow-indigo-500/30 hover:bg-indigo-700 hover:scale-[1.02] transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <CheckCircle2 className="w-5 h-5" />
                        セッションを完了する
                    </button>
                </div>
            </form>
        </div>
    )
}

'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Memo } from '../memo/MemoService'
import { Loader2, Send, Timer, AlertCircle } from 'lucide-react'

type InputReason = {
    id: string
    content: string
}

export function QuestioningPhase({
    memo,
    onComplete,
    onCancel
}: {
    memo: Memo
    onComplete: (reasons: string[]) => void
    onCancel: () => void
}) {
    const [secondsLeft, setSecondsLeft] = useState(180) // 3 minutes
    const [reasons, setReasons] = useState<InputReason[]>([])
    const [currentInput, setCurrentInput] = useState('')
    const [isTimerRunning, setIsTimerRunning] = useState(false)
    const [isTimeUp, setIsTimeUp] = useState(false)
    const inputRef = useRef<HTMLInputElement>(null)

    useEffect(() => {
        // Start timer immediately on mount
        setIsTimerRunning(true)
    }, [])

    useEffect(() => {
        let interval: NodeJS.Timeout
        if (isTimerRunning && secondsLeft > 0) {
            interval = setInterval(() => {
                setSecondsLeft((prev) => {
                    if (prev <= 1) {
                        setIsTimeUp(true)
                        setIsTimerRunning(false)
                        return 0
                    }
                    return prev - 1
                })
            }, 1000)
        }
        return () => clearInterval(interval)
    }, [isTimerRunning, secondsLeft])

    const handleAddReason = (e: React.FormEvent) => {
        e.preventDefault()
        if (!currentInput.trim()) return

        setReasons(prev => [...prev, { id: crypto.randomUUID(), content: currentInput.trim() }])
        setCurrentInput('')
        // Keep focus
        inputRef.current?.focus()
    }

    const handleComplete = () => {
        onComplete(reasons.map(r => r.content))
    }

    const formatTime = (seconds: number) => {
        const m = Math.floor(seconds / 60)
        const s = seconds % 60
        return `${m}:${s.toString().padStart(2, '0')}`
    }

    return (
        <div className="max-w-2xl mx-auto space-y-8 p-4">
            {/* Header / Timer */}
            <div className="flex items-center justify-between bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
                <div className="flex items-center gap-3">
                    <Timer className={`w-6 h-6 ${secondsLeft < 30 ? 'text-red-500 animate-pulse' : 'text-indigo-500'}`} />
                    <span className={`text-2xl font-bold font-mono ${secondsLeft < 30 ? 'text-red-600 dark:text-red-400' : 'text-slate-900 dark:text-slate-100'}`}>
                        {formatTime(secondsLeft)}
                    </span>
                </div>
                <div className="text-right">
                    <p className="text-sm text-slate-500">書き出した理由</p>
                    <p className="text-xl font-bold text-indigo-600 dark:text-indigo-400">{reasons.length}個</p>
                </div>
            </div>

            {/* Target Memo */}
            <div className="bg-indigo-50 dark:bg-indigo-900/20 p-6 rounded-2xl border border-indigo-100 dark:border-indigo-800/50">
                <p className="text-sm text-indigo-600 dark:text-indigo-400 font-medium mb-2">この出来事について</p>
                <div className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100 leading-relaxed">
                    「{memo.content}」
                </div>
                <p className="text-lg text-indigo-600 dark:text-indigo-400 font-bold mt-2">...のはなぜ？</p>
            </div>

            {/* Input Area */}
            <div className="space-y-4">
                <form onSubmit={handleAddReason} className="relative">
                    <div className="relative">
                        <input
                            ref={inputRef}
                            type="text"
                            value={currentInput}
                            onChange={(e) => setCurrentInput(e.target.value)}
                            disabled={isTimeUp}
                            placeholder={isTimeUp ? "時間は終了です！" : "理由を入力してEnter..."}
                            className="w-full px-6 py-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-lg shadow-sm disabled:opacity-50 disabled:bg-slate-100 dark:disabled:bg-slate-800 transition-all"
                            autoFocus
                        />
                        <button
                            type="submit"
                            disabled={!currentInput.trim() || isTimeUp}
                            className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-xl bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 transition-all"
                        >
                            <Send className="w-5 h-5" />
                        </button>
                    </div>
                    {!isTimeUp && (
                        <p className="mt-2 text-center text-slate-400 text-sm">
                            質より量です。思いついたことをどんどん書き出しましょう。
                        </p>
                    )}
                </form>

                {/* Reasons List */}
                <div className="space-y-2">
                    <AnimatePresence mode="popLayout">
                        {[...reasons].reverse().map((reason) => (
                            <motion.div
                                key={reason.id}
                                initial={{ opacity: 0, y: -20 }}
                                animate={{ opacity: 1, y: 0 }}
                                layout
                                className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800 text-slate-700 dark:text-slate-300 shadow-sm"
                            >
                                {reason.content}
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            </div>

            {/* Action Bar */}
            {(isTimeUp || reasons.length >= 5) && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="fixed bottom-0 left-0 right-0 p-4 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 flex justify-center z-10"
                >
                    <div className="max-w-md w-full flex gap-4">
                        <button
                            onClick={onCancel}
                            className="flex-1 py-3 px-6 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 font-medium hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors"
                        >
                            中断する
                        </button>
                        <button
                            onClick={handleComplete}
                            className="flex-[2] py-3 px-6 rounded-xl bg-indigo-600 text-white font-bold shadow-lg shadow-indigo-500/30 hover:bg-indigo-700 hover:scale-[1.02] transition-all flex items-center justify-center gap-2"
                        >
                            これくらいにしてまとめる
                            <span className="bg-white/20 px-2 py-0.5 rounded text-sm font-normal">
                                {reasons.length}個
                            </span>
                        </button>
                    </div>
                </motion.div>
            )}
        </div>
    )
}

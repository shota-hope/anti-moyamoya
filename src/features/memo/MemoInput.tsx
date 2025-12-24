'use client'

import { useState } from 'react'
import { MemoService } from './MemoService'
import { motion } from 'framer-motion'
import { Loader2, Send } from 'lucide-react'

export function MemoInput({ onMemoCreated }: { onMemoCreated?: () => void }) {
    const [content, setContent] = useState('')
    const [isSubmitting, setIsSubmitting] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!content.trim() || isSubmitting) return

        setIsSubmitting(true)
        try {
            await MemoService.createMemo(content)
            setContent('')
            onMemoCreated?.()
        } catch (error) {
            console.error('Failed to create memo:', error)
            alert('メモの保存に失敗しました。もう一度お試しください。')
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-2xl mx-auto p-4"
        >
            <form onSubmit={handleSubmit} className="relative">
                <div className="relative rounded-2xl shadow-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus-within:ring-2 focus-within:ring-indigo-500/20 focus-within:border-indigo-500 transition-all overflow-hidden">
                    <textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        placeholder="今、頭にあるモヤモヤは？"
                        className="w-full h-32 p-4 bg-transparent border-none resize-none focus:ring-0 text-slate-900 dark:text-slate-100 placeholder-slate-400 text-lg leading-relaxed"
                        disabled={isSubmitting}
                    />
                    <div className="flex justify-end p-2 bg-slate-50 dark:bg-slate-900/50 border-t border-slate-100 dark:border-slate-800">
                        <button
                            type="submit"
                            disabled={!content.trim() || isSubmitting}
                            className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 font-medium text-sm hover:bg-slate-800 dark:hover:bg-slate-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                        >
                            {isSubmitting ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                                <Send className="w-4 h-4" />
                            )}
                            メモる
                        </button>
                    </div>
                </div>
            </form>
        </motion.div>
    )
}

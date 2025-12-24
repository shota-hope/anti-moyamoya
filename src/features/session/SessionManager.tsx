'use client'

import { useState } from 'react'
import { MemoContainer } from '../memo/MemoContainer'
import { QuestioningPhase } from './QuestioningPhase'
import { SummarizingPhase } from './SummarizingPhase'
import { Memo } from '../memo/MemoService'
import { SessionService } from './SessionService'
import { AnimatePresence, motion } from 'framer-motion'

type SessionState = 'IDLE' | 'QUESTIONING' | 'SUMMARIZING'

export function SessionManager() {
    const [state, setState] = useState<SessionState>('IDLE')
    const [activeMemo, setActiveMemo] = useState<Memo | null>(null)
    const [sessionId, setSessionId] = useState<string | null>(null)
    const [reasons, setReasons] = useState<string[]>([])

    const handleMemoSelect = async (memo: Memo) => {
        try {
            // Create session in DB
            const session = await SessionService.createSession(memo.id)
            setSessionId(session.id)
            setActiveMemo(memo)
            setState('QUESTIONING')
        } catch (error) {
            console.error('Failed to create session:', error)
            alert('セッションの開始に失敗しました。')
        }
    }

    const handleQuestioningComplete = async (reasons: string[]) => {
        if (!sessionId) return

        try {
            await SessionService.saveReasons(sessionId, reasons)
            setReasons(reasons)
            setState('SUMMARIZING')
        } catch (error) {
            console.error('Failed to save reasons:', error)
            alert('保存に失敗しました。')
        }
    }

    const handleSummarizingComplete = async (keywords: string, conclusion: string, nextAction: string) => {
        if (!sessionId) return

        try {
            await SessionService.updateConclusion(sessionId, keywords, conclusion, nextAction)
            // Reset
            setState('IDLE')
            setActiveMemo(null)
            setSessionId(null)
            setReasons([])
        } catch (error) {
            console.error('Failed to save conclusion:', error)
            alert('完了処理に失敗しました。')
        }
    }

    const handleCancel = () => {
        if (confirm('トレーニングを中断しますか？記録は保存されません。')) {
            setState('IDLE')
            setActiveMemo(null)
            setSessionId(null)
            setReasons([])
        }
    }

    return (
        <AnimatePresence mode="wait">
            {state === 'IDLE' && (
                <motion.div
                    key="idle"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                >
                    <MemoContainer onMemoSelect={handleMemoSelect} />
                </motion.div>
            )}

            {state === 'QUESTIONING' && activeMemo && (
                <motion.div
                    key="questioning"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                >
                    <QuestioningPhase
                        memo={activeMemo}
                        onComplete={handleQuestioningComplete}
                        onCancel={handleCancel}
                    />
                </motion.div>
            )}

            {state === 'SUMMARIZING' && (
                <motion.div
                    key="summarizing"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                >
                    <SummarizingPhase
                        reasons={reasons}
                        memoContent={activeMemo?.content || ''}
                        onComplete={handleSummarizingComplete}
                        onCancel={handleCancel}
                    />
                </motion.div>
            )}
        </AnimatePresence>
    )
}

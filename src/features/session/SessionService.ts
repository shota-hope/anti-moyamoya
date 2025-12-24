import { createClient } from '@/lib/supabase/client'
import { v4 as uuidv4 } from 'uuid'

export type Session = {
    id: string
    memo_id: string
    user_id: string
    created_at: string
    conclusion?: string
    next_action?: string
    keywords?: string
}

export type SessionReason = {
    id: string
    session_id: string
    content: string
    created_at: string
}

export const SessionService = {
    async createSession(memoId: string) {
        const supabase = createClient()
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) throw new Error('User not authenticated')

        const sessionId = uuidv4()

        const { data, error } = await supabase
            .from('sessions')
            .insert({
                id: sessionId,
                memo_id: memoId,
                user_id: user.id,
            })
            .select()
            .single()

        if (error) throw error
        return data as Session
    },

    async saveReasons(sessionId: string, reasons: string[]) {
        const supabase = createClient()

        const reasonsData = reasons.map(content => ({
            id: uuidv4(),
            session_id: sessionId,
            content,
        }))

        const { error } = await supabase
            .from('session_reasons')
            .insert(reasonsData)

        if (error) throw error
    },

    // For future use
    async updateConclusion(sessionId: string, keywords: string, conclusion: string, nextAction: string) {
        const supabase = createClient()
        const { data, error } = await supabase
            .from('sessions')
            .update({ keywords, conclusion, next_action: nextAction })
            .eq('id', sessionId)
            .select('memo_id')
            .single()

        if (error) throw error

        // Mark memo as completed
        if (data?.memo_id) {
            const { error: memoError } = await supabase
                .from('memos')
                .update({ completed: true })
                .eq('id', data.memo_id)

            if (memoError) throw memoError
        }
    },

    async fetchHistory() {
        const supabase = createClient()
        const { data, error } = await supabase
            .from('sessions')
            .select('*, memo:memos(*), reasons:session_reasons(*)')
            .not('conclusion', 'is', null)
            .order('created_at', { ascending: false })

        if (error) throw error
        return data as (Session & {
            memo: { content: string } | null
            reasons: { content: string }[]
        })[]
    }
}

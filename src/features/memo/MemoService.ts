import { createClient } from '@/lib/supabase/client'
import { v4 as uuidv4 } from 'uuid'

export type Memo = {
    id: string
    user_id: string
    content: string
    created_at: string
    updated_at: string
}

export const MemoService = {
    async createMemo(content: string) {
        const supabase = createClient()
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) {
            throw new Error('User not authenticated')
        }

        const { data, error } = await supabase
            .from('memos')
            .insert({
                id: uuidv4(),
                user_id: user.id,
                content,
            })
            .select()
            .single()

        if (error) {
            throw error
        }

        return data as Memo
    },

    async fetchMemos() {
        const supabase = createClient()

        // RLS will automatically filter for the current user
        const { data, error } = await supabase
            .from('memos')
            .select('*')
            .eq('completed', false)
            .order('created_at', { ascending: false })

        if (error) {
            throw error
        }

        return data as Memo[]
    }
}

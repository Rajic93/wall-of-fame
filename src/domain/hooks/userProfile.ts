import { useEffect, useState } from 'react';
import supabase from '../services/supabase.ts';
import useSession from './useSession.ts';

const useUserData = () => {
    const [boards, setBoards] = useState<any[]>([]);
    const [total, setTotal] = useState(0);
    const { session } = useSession();

    const fetchBoards = async (userId?: string) => {
        const { count, data } = await supabase.from('boards').select('*', { count: 'exact' })
            .or(`${session && userId ? `user_id.eq.${userId},` : ''}is_public.eq.true`)
        setBoards(data || []);
        setTotal(count || 0);
    }
    const fetchBoardById = async (boardId: number) => {
        const { data } = await supabase.from('boards').select('*')
            .eq('id', boardId)
            .single();
        if (!data) {
            return null;
        }
        return {
            id: data.id,
            userId: data.user_id,
            createdAt: data.created_at,
            updatedAt: data.updated_at,
            isReadOnly: data.is_read_only,
            isPublic: data.is_public,
            title: data.title,
            description: data.description,
            config: data.config,
        };
    }

    useEffect(() => {
        fetchBoards(session?.user?.id);
    }, [session]);

    return { boards, total, fetchBoards, fetchBoardById };
};

export default useUserData;

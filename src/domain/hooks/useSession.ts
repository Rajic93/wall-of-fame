import { useEffect, useState } from 'react';
import { Session } from '@supabase/supabase-js';
import supabase from '../services/supabase.ts';

const useSession = () => {
    const [session, setSession] = useState<Session | null>(null);
    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => setSession(session))

        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session)
        })

        return () => subscription.unsubscribe()
    }, []);

    const signOut = () => {
        supabase.auth.signOut();
        setSession(null);
    }

    const actions = { signOut };

    return { session, actions };
};

export default useSession;

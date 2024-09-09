import {useEffect, useState} from "react";
import supabase from "../services/supabase.ts";

const useSession = () => {
    const [session, setSession] = useState(null);
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

    return { session, signOut };
};

export default useSession;

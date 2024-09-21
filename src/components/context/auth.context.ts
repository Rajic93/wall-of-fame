import { createContext } from 'react';

export type AuthActions = {
    signOut: () => void;
}

export interface AuthContext {
    session?: Record<string, any> | null;
    actions?: AuthActions;
}

const initialState = {};

const authContext = createContext<AuthContext>(initialState);

export default authContext;

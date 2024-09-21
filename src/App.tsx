import Router from './routes';
import useSession from './domain/hooks/useSession.ts';
import AuthContext from './components/context/auth.context.ts';

const App = () => {
    const { session, actions } = useSession();

    return (
        <div style={{ margin: 100 }}>
            <AuthContext.Provider value={{ session, actions }}>
                <Router />
            </AuthContext.Provider>
        </div>
    );
}

export default App

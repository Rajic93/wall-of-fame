import { ReactNode } from 'react';
import SignIn from '../../molecules/SignIn';

interface AuthenticatedPageProps {
    children?: ReactNode;
}

const AuthenticatedPage = ({ children }: AuthenticatedPageProps) => (
    <>
        <SignIn />
        {children}
    </>
);

export default AuthenticatedPage;

import {useEffect, useState} from 'react'
import {Auth} from '@supabase/auth-ui-react'
import {ThemeSupa} from '@supabase/auth-ui-shared'
import supabase from "../../services/supabase.ts";
import {Modal} from "antd";
import Icon, {IconType} from "../../atoms/Icon";
import './index.css';
import useSession from "../../hooks/useSession.tsx";


export default function SignIn() {
    const { session, signOut } = useSession();
    const [isModalOpen, setIsModalOpen] = useState(false);

    const showModal = () => setIsModalOpen(true);

    const handleOk = () => setIsModalOpen(false);

    const handleCancel = () => setIsModalOpen(false);

    const handleSignOut = () => signOut();

    if (!session) {
        return (
                <>
                    <span onClick={showModal} className="signin-icon">
                        <Icon type={IconType.PROFILE} />
                    </span>
                    <Modal
                        title="Sign In"
                        open={isModalOpen}
                        onOk={handleOk}
                        onCancel={handleCancel}
                        footer={null}
                    >
                        <Auth
                            supabaseClient={supabase}
                            appearance={{ theme: ThemeSupa }}
                            providers={['google']}
                        />
                    </Modal>
                </>
        );
    }

    return (
        <span
            onClick={handleSignOut}
            className="signin-icon"
        >
            <Icon type={IconType.SIGN_OUT}/>
        </span>
    );
}
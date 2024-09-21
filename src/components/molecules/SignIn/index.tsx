import {useContext, useState} from 'react'
import { Auth } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared'
import { Modal, Typography } from 'antd';
import Icon, { IconType } from '../../atoms/Icon';
import AuthContext from '../../context/auth.context.ts';
import supabase from '../../../domain/services/supabase.ts';
import './index.css';


export default function SignIn() {
    const { session, actions } = useContext(AuthContext);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const showModal = () => setIsModalOpen(true);

    const handleOk = () => setIsModalOpen(false);

    const handleCancel = () => setIsModalOpen(false);

    const handleSignOut = () => actions?.signOut();

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

    let fullName;
    if (session?.user?.identities && session.user.identities[0] && session.user.identities[0].identity_data) {
        fullName = session.user.identities[0].identity_data.full_name
    }

    return (
        <span
            onClick={handleSignOut}
            className="signin-icon"
        >
            <Typography.Text style={{ fontSize: 18, marginRight: 10 }}>{fullName}</Typography.Text>
            <Icon type={IconType.SIGN_OUT}/>
        </span>
    );
}
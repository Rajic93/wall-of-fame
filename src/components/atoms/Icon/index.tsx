import { UserOutlined, LogoutOutlined } from '@ant-design/icons';
import GoogleIcon from './GoogleIcon.tsx';

export enum IconType {
    GOOGLE_LOGIN = 'GOOGLE_LOGIN',
    PROFILE = 'PROFILE',
    SIGN_OUT = 'SIGN_OUT',
}

export interface IconProps {
    type: IconType;
}

const Icon = ({ type, ...props }: IconProps) => {
    if (type === IconType.GOOGLE_LOGIN) {
        return <GoogleIcon {...props} />;
    }
    if (type === IconType.PROFILE) {
        return <UserOutlined {...props} />;
    }
    if (type === IconType.SIGN_OUT) {
        return <LogoutOutlined {...props} />;
    }

    return null;
}

export default Icon;

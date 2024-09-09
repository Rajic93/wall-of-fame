import GoogleIcon from "./GoogleIcon.tsx";
import ProfileIcon from "./ProfileIcon.tsx";
import ExitIcon from "./ExitIcon.tsx";

export enum IconType {
    GOOGLE_LOGIN = 'GOOGLE_LOGIN',
    PROFILE = 'PROFILE',
    SIGN_OUT = 'SIGN_OUT',
}

export interface IconProps {
    type: IconType;
}

const Icon = ({ type }: IconProps) => {
    if (type === IconType.GOOGLE_LOGIN) {
        return <GoogleIcon />;
    }
    if (type === IconType.PROFILE) {
        return <ProfileIcon />;
    }
    if (type === IconType.SIGN_OUT) {
        return <ExitIcon />;
    }

    return null;
}

export default Icon;

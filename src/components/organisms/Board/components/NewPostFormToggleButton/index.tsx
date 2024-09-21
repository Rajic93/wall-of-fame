import { CloseCircleOutlined, PlusCircleOutlined } from '@ant-design/icons';

export interface NewPostFormToggleButtonProps {
    isOpen: boolean;
    onToggle?: (isOpen: boolean) => void;
}

const NewPostFormToggleButton = ({ isOpen = false, onToggle = () => {} }: NewPostFormToggleButtonProps) => (
    <>
        {!isOpen ? (
            <PlusCircleOutlined
                onClick={() => onToggle(true)}
            />
        ) : null}
        {isOpen ? (
            <CloseCircleOutlined
                onClick={() => onToggle(false)}
            />
        ) : null}
    </>
);

export default NewPostFormToggleButton;

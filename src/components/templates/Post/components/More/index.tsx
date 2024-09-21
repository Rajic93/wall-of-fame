import { useState } from 'react';
import { DeleteOutlined, MoreOutlined } from '@ant-design/icons';
import './index.css';

interface MoreProps {
    onDelete: () => void;
}

const More = ({ onDelete }: MoreProps) => {
    const [open, setOpen] = useState(false);

    const handleOnDelete = () => {
        onDelete();
        handleOnBackdropClick();
    }

    const handleOnBackdropClick = () => setOpen(false);

    return (
        <div className="more">
            {open ? (
                <div
                    className="more_backdrop"
                    onClick={handleOnBackdropClick}
                />
            ) : null}
            <MoreOutlined
                onClick={() => setOpen(true)}
            />
            {open ? (
                <div
                    className="more_delete"
                    onClick={handleOnDelete}
                >
                    <span>Delete</span>
                    <DeleteOutlined />
                </div>
            ) : null}
        </div>
    )
}

export default More;
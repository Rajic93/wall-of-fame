import { Typography } from 'antd';
import './index.css';

export interface BoardTitleProps {
    text?: string;
}

const BoardTitle = ({ text = '' }: BoardTitleProps) => text ? (
    <div className="board-title">
        <Typography.Title level={3}>{text}</Typography.Title>
    </div>
): null;

export default BoardTitle;


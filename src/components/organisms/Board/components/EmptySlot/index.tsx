import { Typography } from 'antd';
import { PostSizes } from '../../../../../domain/models/Post.ts';
import { sizeSpanClassMapping } from '../../../../../utils/mappings.ts';
import './index.css'

export interface EmptySlotProps {
    onDragEnd?: (e: number | string) => void;
    onSelect?: (e: number | string) => void;
    shouldShow: boolean;
    key: string | number;
    showKey?: boolean;
    size?: PostSizes;
    isSelected?: boolean,
}

const EmptySlot = ({ onDragEnd, shouldShow = false, key, onSelect, size = PostSizes.v1x1, isSelected }: EmptySlotProps) => (
    <div
        onDragOver={() => onDragEnd && onDragEnd(key)}
        onClick={() => onSelect && onSelect(key)}
        className={`empty-slot ${shouldShow ? 'empty-slot--visible' : ''} ${isSelected ? 'empty-slot--selected' : ''} ${sizeSpanClassMapping[size]}`}
    >
        {shouldShow ? (
            <Typography.Text>
                {/*Empty Slot {showKey ? key : ''}*/}
            </Typography.Text>
        ) : null}
    </div>
);

export default EmptySlot;

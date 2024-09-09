import { Typography } from "antd";
import './index.css'
import {sizeSpanClassMapping} from "../../utils/mappings.ts";
import {PostSizes} from "../../templates/Post/types.ts";

export interface EmptySlotProps {
    onDragEnd?: (e: number | string) => void;
    shouldShow: boolean;
    key: string | number;
    showKey?: boolean;
    size?: PostSizes;
}

const EmptySlot = ({ onDragEnd, shouldShow = false, key, showKey = false, size }: EmptySlotProps) => (
    <div
        onDragOver={() => onDragEnd && onDragEnd(key)}
        className={`empty-slot ${shouldShow ? 'empty-slot--visible' : 'empty-slot--hidden'} ${sizeSpanClassMapping[size]}`}
    >
        {shouldShow ? (
            <Typography.Text>
                Empty Slot {showKey ? key : ''}
            </Typography.Text>
        ) : null}
    </div>
);

export default EmptySlot;

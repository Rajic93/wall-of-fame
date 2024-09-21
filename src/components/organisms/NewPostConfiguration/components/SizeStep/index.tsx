import { Radio, RadioChangeEvent, Space } from 'antd';
import { PostSizes } from '../../../../../domain/models/Post.ts';

interface SizeStepProps {
    size: PostSizes;
    onSizeChange: (sizes: RadioChangeEvent) => void;
    filter?: PostSizes[];
}

const options = [
    {
        label: 'Small Box (1x1)',
        value: PostSizes.v1x1,
    },
    {
        label: 'Horizontal (1x2)',
        value: PostSizes.v1x2,
    },
    {
        label: 'Vertical (2x1)',
        value: PostSizes.v2x1,
    },
    {
        label: 'Medium Box (2x2)',
        value: PostSizes.v2x2,
    },
    {
        label: 'Large Box (4x4)',
        value: PostSizes.v4x4,
    },
];

const SizeStep = ({ size, onSizeChange, filter }: SizeStepProps) => (
    <Radio.Group onChange={onSizeChange} value={size}>
        <Space direction="vertical">
            {options.map(({ label, value }) => (
                <Radio
                    value={value}
                    className="size-step-radio"
                    disabled={filter && !filter.includes(value)}
                >
                    {label}
                </Radio>
            ))}
        </Space>
    </Radio.Group>
);

export default SizeStep;
import { Radio, RadioChangeEvent, Space } from 'antd';
import { PostTypes } from '../../../../../domain/models/Post.ts';

interface TypeStepProps {
    type: PostTypes;
    onTypeChange: (sizes: RadioChangeEvent) => void;
}

const options = [
    // {
    //     label: 'Poster',
    //     value: PostTypes.POSTER,
    // },
    {
        label: 'X.com',
        value: PostTypes.TWITTER,
    },
    {
        label: 'Instagram',
        value: PostTypes.INSTAGRAM,
    },
    {
        label: 'Facebook',
        value: PostTypes.FACEBOOK,
    },
    {
        label: 'You Tube',
        value: PostTypes.YOU_TUBE,
    },
    {
        label: 'Pinterest',
        value: PostTypes.PINTEREST,
    },
];

const TypeStep = ({ type, onTypeChange }: TypeStepProps) => (
    <div>
        <Radio.Group
            onChange={onTypeChange}
            value={type}
        >
            <Space direction="vertical" defaultValue={type}>
                {options.map(({ label, value }) => (
                    <Radio
                        value={value}
                        className="size-step-radio"
                    >
                        {label}
                    </Radio>
                ))}
            </Space>
        </Radio.Group>
    </div>
);

export default TypeStep;

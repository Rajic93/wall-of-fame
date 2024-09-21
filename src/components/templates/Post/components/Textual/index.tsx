import {
    sizeHeightMapping,
    sizeSpanClassMapping,
    sizeWidthMapping,
} from '../../../../../utils/mappings.ts';
import { PostSizes } from '../../../../../domain/models/Post.ts';
import { PostModes } from '../../types.ts';
import './index.css';

export interface TextualProps {
    size?: PostSizes;
    text: string;
    mode?: PostModes;
}

const Textual = ({ size = PostSizes.v1x1, text = '' }: TextualProps) => {
    const width = sizeWidthMapping[size];
    const height = sizeHeightMapping[size];
    return (
        <div
            style={{
                width,
                height,
            }}
            className={`textual-slot ${sizeSpanClassMapping[size]}`}
        >
            {text}
        </div>
    );
};

export default Textual;

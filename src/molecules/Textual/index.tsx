import {
    sizeHeightMapping,
    sizeSpanClassMapping,
    sizeWidthMapping,
} from "../../utils/mappings.ts";
import './index.css';
import { PostSizes } from "../../templates/Post/types.ts";

export interface TextualProps {
    size?: PostSizes;
    text: string;
}

const Textual = ({ size = PostSizes.v1x1, text = '' }: TextualProps) => {
    const width = sizeWidthMapping[size];
    const height = sizeHeightMapping[size];
    return (
        <div
            style={{
                width,
                height,
                position: 'relative',
            }}
            className={`textual-slot ${sizeSpanClassMapping[size]}`}
        >
            {text}
        </div>
    );
};

export default Textual;

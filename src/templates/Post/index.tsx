import Poster, { PosterProps } from "../../molecules/Poster";
import { PostTypes } from "./types.ts";
import Textual, {TextualProps} from "../../molecules/Textual";

// TODO: fix type inference
interface TypeProp {
    type: PostTypes;
}

export type PosterPostProps = TypeProp & PosterProps;

export type TextualPostProps = TypeProp & TextualProps;

const Post = ({ type, ...props }: PosterPostProps | TextualPostProps) => {
    switch (type) {
        case PostTypes.TEXT:
            return (
                <Textual
                    size={props.size}
                    text={(props as TextualPostProps).text}
                    {...props}
                />
            );
        case PostTypes.POSTER:
            return (
                <Poster
                    size={props.size}
                    imageSrc={(props as PosterProps).imageSrc}
                />
            );
        default:
            return null;
    }
};

export default Post;

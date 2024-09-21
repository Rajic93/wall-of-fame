import { PostTypes } from '../../../domain/models/Post';
import Poster, { PosterProps } from './components/Poster';
import Textual, { TextualProps } from './components/Textual';
import XPost, { XProps } from './components/XPost';
import MetaPost, { MetaProps } from './components/Meta';
import YouTubePost, { YouTubeProps } from './components/YouTube';
import PinterestPost, { PinterestProps } from './components/Pinterest';
import { PostModes } from './types.ts';

export interface TypeProp {
    type: PostTypes;
    mode?: PostModes;
}

export type PosterPostProps = TypeProp & PosterProps;

export type TextualPostProps = TypeProp & TextualProps;

export type XPostProps = TypeProp & XProps;
export type MetaPostProps = TypeProp & MetaProps;
export type YouTubePostProps = TypeProp & YouTubeProps;
export type PinterestPostProps = TypeProp & PinterestProps;

const Post = ({
    type,
    mode = PostModes.VIEW,
    ...props
}: PosterPostProps | TextualPostProps | XPostProps) => {
    switch (type) {
        case PostTypes.TEXT:
            return (
                <Textual
                    size={(props as TextualPostProps).size}
                    text={(props as TextualPostProps).text}
                    mode={mode}
                    {...props}
                />
            );
        case PostTypes.POSTER:
            return (
                <Poster
                    size={(props as PosterProps).size}
                    imageSrc={(props as PosterProps).imageSrc}
                    mode={mode}
                    {...props as PosterPostProps}
                />
            );
        case PostTypes.TWITTER:
            return (
                <XPost
                    postId={(props as XPostProps).postId}
                    id={(props as XPostProps).id}
                    mode={mode}
                    noScale
                />
            );
        case PostTypes.INSTAGRAM:
            return <MetaPost
                url={(props as MetaPostProps)?.url}
                mode={mode}
                noScale
                flat
                type={PostTypes.INSTAGRAM}
            />
        case PostTypes.FACEBOOK:
            return <MetaPost
                url={(props as MetaPostProps)?.url}
                mode={mode}
                noScale
                flat
                type={PostTypes.FACEBOOK}
            />
        case PostTypes.YOU_TUBE:
            return <YouTubePost
                url={(props as YouTubePostProps)?.url}
                mode={mode}
                noScale
                flat
            />
        case PostTypes.PINTEREST:
            return <PinterestPost
                url={(props as PinterestPostProps)?.url}
                mode={mode}
                noScale
                flat
            />
        default:
            return null;
    }
};

export default Post;

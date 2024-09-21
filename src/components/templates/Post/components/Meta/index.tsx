import { FacebookEmbed, InstagramEmbed } from 'react-social-media-embed';
import { PostTypes } from '../../../../../domain/models/Post.ts';
import PostContainer, { PostContainerProps } from '../PostContainer';

export type MetaPostType = PostTypes.INSTAGRAM | PostTypes.FACEBOOK;
export type MetaProps = { type: MetaPostType }
    & Omit<PostContainerProps, 'componentRenderer' | 'inputParser' | 'inputLabel' | 'useLoading'>;

const MetaPost = (props: MetaProps) => (
    <PostContainer
        {...props}
        componentRenderer={({ postId }) => (
            <>
                {props.type === PostTypes.INSTAGRAM ? (
                    <InstagramEmbed
                        url={postId.toString()}
                        width={330}
                    />
                ): null}
                {props.type === PostTypes.FACEBOOK ? (
                    <FacebookEmbed
                        url={postId.toString()}
                        width={330}
                    />
                ): null}
            </>
        )}
        inputLabel={`${props.type === PostTypes.FACEBOOK ? ' Facebook' : 'Instagram'} URL`}
        useLoading={false}
    />
);

export default MetaPost;

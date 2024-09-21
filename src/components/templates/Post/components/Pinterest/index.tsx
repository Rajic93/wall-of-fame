import { PinterestEmbed } from 'react-social-media-embed';
import PostContainer, { PostContainerProps } from '../PostContainer';

export type PinterestProps = Omit<PostContainerProps, 'componentRenderer' | 'inputParser' | 'inputLabel' | 'useLoading'>

const PinterestPost = (props: PinterestProps) => (
    <PostContainer
        {...props}
        componentRenderer={({ postId }) => (
            <PinterestEmbed
                url={postId.toString()}
                width={330}
            />
        )}
        inputLabel="Pin URL"
        useLoading={false}
    />
);

export default PinterestPost;

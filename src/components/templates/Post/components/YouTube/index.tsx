import { YouTubeEmbed } from 'react-social-media-embed';
import PostContainer, { PostContainerProps } from '../PostContainer';

export type YouTubeProps = Omit<PostContainerProps, 'componentRenderer' | 'inputParser' | 'inputLabel' | 'useLoading'>

const YouTubePost = (props: YouTubeProps) => (
    <PostContainer
        {...props}
        componentRenderer={({ postId }) => (
            <YouTubeEmbed
                url={postId.toString()}
                width={330}
            />
        )}
        inputLabel="Video URL"
        useLoading={false}
    />
);

export default YouTubePost;

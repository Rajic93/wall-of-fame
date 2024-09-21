import { Tweet } from 'react-twitter-widgets';
import PostContainer, { PostContainerProps } from '../PostContainer';

export type XProps = Omit<PostContainerProps, 'componentRenderer' | 'inputParser' | 'inputLabel' | 'useLoading'>

const XPost = (props: XProps) => {
    const inputParser = (value: string) => {
        // TODO: parse id from string
        return value;
    };

    return (
        <PostContainer
            {...props}
            componentRenderer={({ postId, onLoad }) => (
                <Tweet
                    tweetId={postId.toString()}
                    onLoad={onLoad}
                />
            )}
            inputLabel="Tweet ID"
            inputParser={inputParser}
        />
    )
}

export default XPost;

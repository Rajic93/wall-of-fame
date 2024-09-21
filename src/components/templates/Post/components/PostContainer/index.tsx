import { ReactNode, useState } from 'react';
import { Col } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import { sizeSpanClassMapping } from '../../../../../utils/mappings.ts';
import usePosts from '../../../../../domain/hooks/posts.ts';
import { PostSizes } from '../../../../../domain/models/Post.ts';
import { PostModes } from '../../types.ts';
import More from '../More';
import './index.css';

export interface PostElementProps {
    postId: string | number;
    onLoad: () => void;
}

export interface PostContainerProps {
    postId?: string,
    id?: number,
    url?: string,
    onContentSet?: (e: string) => void;
    noScale?: boolean;
    flat?: boolean;
    mode: PostModes;
    inputLabel?: string,
    inputParser?: (input: string) => string;
    componentRenderer: (props: PostElementProps) => ReactNode;
    useLoading?: boolean;
}

const PostContainer = ({
    postId = '',
    url = '',
    inputLabel,
    inputParser = (e) => e,
    useLoading = true,
    id: recordId,
    onContentSet,
    mode = PostModes.VIEW,
    noScale,
    flat,
    componentRenderer
}: PostContainerProps) => {
    const [id, setPostId] = useState<string>(postId || url);
    const [isLoading, setIsLoading] = useState<boolean>(useLoading);
    const { deletePost } = usePosts();

    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = inputParser(e.target.value);
        setPostId(value);
        if (onContentSet) {
            onContentSet(value);
        }
    }

    const onDelete = () => recordId && deletePost(recordId);
    console.log({ mode })

    return (
        <Col
            className={`post ${mode === PostModes.VIEW ? `${sizeSpanClassMapping[PostSizes.v2x1]}` : ''}`}
        >
            {mode !== PostModes.VIEW && useLoading && !isLoading ? (
                <div
                    className="post-menu"
                >
                    <More onDelete={onDelete} />
                </div>
            ) : null}
            {mode === PostModes.CREATE ? (
                <div>
                    {inputLabel}: <input onChange={onChange} value={id}/>
                </div>
            ) : null}
            <div className={`post-container ${flat ? 'post-container--flat' : ''} ${ !noScale ? 'post-container--scaled' : ''}`}>
                {id && typeof componentRenderer === 'function'
                    ? componentRenderer({ postId: id, onLoad: () => setIsLoading(false) })
                    : null}
                {mode !== PostModes.CREATE && useLoading && isLoading ? (
                    <div
                        className="post-loader"
                    >
                        <LoadingOutlined />
                    </div>
                ) : null}
            </div>
        </Col>
    );
}

export default PostContainer;

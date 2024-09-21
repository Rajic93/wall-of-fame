import { PostSizes, PostTypes } from '../../../../../domain/models/Post.ts';
import Poster from '../../../../templates/Post/components/Poster';
import XPost from '../../../../templates/Post/components/XPost';
import MetaPost from '../../../../templates/Post/components/Meta';
import YouTubePost from '../../../../templates/Post/components/YouTube';
import PinterestPost from '../../../../templates/Post/components/Pinterest';
import { PostModes } from '../../../../templates/Post/types.ts';

interface ContentStepProps {
    type: PostTypes,
    content: Record<string, string> | string;
    onContentSet?: (content: Record<string, string | File>) => void;
}

const ContentStep = ({ type, content, onContentSet = () => {} }: ContentStepProps) => (
    <>
        {type === PostTypes.POSTER ? (
            <Poster
                mode={PostModes.CREATE}
                size={PostSizes.v1x1}
                upload
                imageSrc={(content as Record<string, string>)?.imageSrc}
                onUploadCompleted={(imageSrc: string, file: File) => onContentSet({ imageSrc, file })}
                flat
            />
        ) : null}
        {type === PostTypes.TWITTER ? (
            <XPost
                mode={PostModes.CREATE}
                postId={(content as Record<string, string>)?.postId}
                onContentSet={(postId: string) => onContentSet({ postId })}
                noScale
                flat
            />
        ) : null}
        {type === PostTypes.INSTAGRAM ? (
            <MetaPost
                mode={PostModes.CREATE}
                url={(content as Record<string, string>)?.url}
                onContentSet={(url: string) => onContentSet({ url })}
                noScale
                flat
                type={PostTypes.INSTAGRAM}
            />
        ) : null}
        {type === PostTypes.FACEBOOK ? (
            <MetaPost
                mode={PostModes.CREATE}
                url={(content as Record<string, string>)?.url}
                onContentSet={(url: string) => onContentSet({ url })}
                noScale
                flat
                type={PostTypes.FACEBOOK}
            />
        ) : null}
        {type === PostTypes.YOU_TUBE ? (
            <YouTubePost
                mode={PostModes.CREATE}
                url={(content as Record<string, string>)?.url}
                onContentSet={(url: string) => onContentSet({ url })}
                noScale
                flat
            />
        ) : null}
        {type === PostTypes.PINTEREST ? (
            <PinterestPost
                mode={PostModes.CREATE}
                url={(content as Record<string, string>)?.url}
                onContentSet={(url: string) => onContentSet({ url })}
                noScale
                flat
            />
        ) : null}
    </>
);

export default ContentStep;
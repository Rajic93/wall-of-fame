import { useRef, useState } from 'react';
import { Card, Image } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import usePosts from '../../../../../domain/hooks/posts.ts';
import { PostSizes } from '../../../../../domain/models/Post.ts';
import { sizeHeightMapping, sizeSpanClassMapping, sizeWidthMapping } from '../../../../../utils/mappings.ts';
import { PostModes } from '../../types.ts';
import More from '../More';
import './index.css'


export interface PosterProps {
    size?: PostSizes;
    imageSrc?: string;
    upload?: boolean;
    flat?: boolean;
    mode?: PostModes;
    id?: number;
    fileId?: string;
    onUploadCompleted?: (url: string, file: File) => void;
}

const Poster = ({ size = PostSizes.v1x1, imageSrc = '', id, flat = false, upload, onUploadCompleted, mode = PostModes.VIEW }: PosterProps) => {
    const width = sizeWidthMapping[size];
    const height = sizeHeightMapping[size];

    const [file, setFile] = useState(imageSrc);
    const uploadRef = useRef();
    const { deletePost } = usePosts();

    // @ts-ignore
    const onUploadClick = () => uploadRef.current?.click();
    const onChangeHandler = (e: React.ChangeEvent<HTMLDivElement>) => {
        // @ts-ignore
        const file = e.target.files[0];
        if (file) {
            const fileUrl = URL.createObjectURL(file)
            setFile(fileUrl);
            if (typeof onUploadCompleted === 'function') {
                onUploadCompleted(fileUrl, file)
            }
        }
    }
    const onRemoveImage = () => {
        if (!id) {
            return;
        }
        setFile('');
        deletePost(id);
    }

    if (upload && !file) {
        return (
            <>
                <Card
                    className={`upload-card ${sizeSpanClassMapping[size]} ${flat ? 'upload-card--flat' : ''}`}
                    style={{
                        width,
                        height,
                    }}
                    onClick={onUploadClick}
                >
                    <UploadOutlined />
                </Card>
                <input
                    type="file"
                    // @ts-ignore
                    ref={uploadRef}
                    className="upload-input"
                    onChange={onChangeHandler}
                />
            </>
        );
    }

    return (
        <div
            style={{
                width,
                height,
            }}
            className={`poster ${sizeSpanClassMapping[size]} ${flat ? 'upload-card--flat' : 'upload-card'}`}
        >
            {mode === PostModes.EDIT ? (
                <div className="poster_menu">
                    <More onDelete={onRemoveImage}/>
                </div>
            ) : null}
            <Image
                src={file || imageSrc}
                width={width}
                height={height}
                className="poster_image"
            />
        </div>
    );
};

export default Poster;

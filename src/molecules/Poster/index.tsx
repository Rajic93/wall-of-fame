import { sizeHeightMapping, sizeSpanClassMapping, sizeWidthMapping } from "../../utils/mappings.ts";
import { Card, Image } from "antd";
import { PostSizes } from "../../templates/Post/types.ts";
import {useRef, useState} from "react";
import {DeleteOutlined, UploadOutlined} from "@ant-design/icons";
import './index.css'
import XPost from "../../templates/XPost";

export interface PosterProps {
    size?: PostSizes;
    imageSrc?: string;
    upload?: boolean;
}

const Poster = ({ size = PostSizes.v1x1, imageSrc = '', upload }: PosterProps) => {
    const width = sizeWidthMapping[size];
    const height = sizeHeightMapping[size];

    const [file, setFile] = useState(null);
    const uploadRef = useRef();
    const onUploadClick = () => uploadRef.current?.click();
    const onChangeHandler = (e: React.ChangeEvent<HTMLDivElement>) => {
        const file = e.target.files[0];
        if (file) {
            const fileUrl = URL.createObjectURL(file)
            setFile(fileUrl)
        }
    }
    const onRemoveImage = () => setFile(null);

    if (upload && !file) {
        return (
            <>
                <Card
                    className={`upload-card ${sizeSpanClassMapping[size]}`}
                    style={{
                        width,
                        height,
                        position: 'relative',
                        cursor: 'pointer',
                    }}
                    onClick={onUploadClick}
                >
                    <UploadOutlined style={{fontSize: 48}}/>
                </Card>
                <input
                    type="file"
                    ref={uploadRef}
                    style={{visibility: "hidden", width: 0, height: 0}}
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
                position: 'relative',
                backgroundColor: 'floralwhite'
            }}
            className={`${sizeSpanClassMapping[size]}`}
        >
            <DeleteOutlined
                onClick={onRemoveImage}
                style={{ position: 'absolute', top: 10, right: 10, zIndex: 10, color: 'palevioletred', fontSize: 18, cursor: 'pointer' }}
            />
            <Image
                src={file || imageSrc}
                width={width}
                height={height}
            />
        </div>
    );
};

export default Poster;

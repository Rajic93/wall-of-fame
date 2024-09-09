import {Radio, RadioChangeEvent, Space, Typography, Upload, UploadFile, UploadProps} from "antd";
import DraggableElement from "../../molecules/DraggableElement";
import Poster from "../../molecules/Poster";
import {useState} from "react";
import {PostSizes, PostTypes} from "../../templates/Post/types.ts";
import {CloseOutlined} from "@ant-design/icons";
import XPost from "../../templates/XPost";

export type NewPostInstanceValue = string | number | boolean | DragEvent;

interface NewPostConfigurtionProps {
    onDragStart?: (data: Record<string, NewPostInstanceValue>) => void;
    onDrag?: (data: Record<string, NewPostInstanceValue>) => void;
    onDragEnd?: (data: Record<string, NewPostInstanceValue>) => void;
    onSizeChange: (e: number) => void;
    onTypeChange: (e: number) => void;
    onClose: () => void;
}

const NewPostConfiguration = ({
    onDragStart,
    onDrag,
    onDragEnd,
    onClose,
    onSizeChange,
}: NewPostConfigurtionProps) => {
    const [size, setSize] = useState(PostSizes.v1x1);
    const [type, setType] = useState(PostTypes.TEXT);
    const [newPost, setNewPost] = useState({
        id: 'testing',
        content: 'Move me!',
    });

    const handleOnDragStart: React.DragEventHandler<HTMLDivElement> = (event) => {
        if (typeof onDragStart === 'function') {
            onDragStart({
                ...newPost,
                event: event as unknown as DragEvent,
                size,
                type,
            });
        }
    }
    const handleOnDrag: React.DragEventHandler<HTMLDivElement> = (event) => {
        if (typeof onDrag === 'function') {
            onDrag({
                ...newPost,
                event: event as unknown as DragEvent,
                size,
                type,
            });
        }
    }
    const handleOnDragEnd: React.DragEventHandler<HTMLDivElement> = (event) => {
        if (typeof onDragEnd === 'function') {
            onDragEnd({
                ...newPost,
                event: event as unknown as DragEvent,
                size,
                type,
            });
        }
    }

    const handleOnSizeChange = (e: RadioChangeEvent) => {
        setSize(e.target.value);
        onSizeChange(e.target.value);
    }

    const handleOnTypeChange = (e: RadioChangeEvent) => setType(e.target.value);

    return (
        <div
            className="slot-configuration"
        >
            <div
                style={{
                    position: 'relative',
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'center',
                    width: '100%'
                }}>
                <div style={{width: 250, position: 'relative'}}>
                    <Typography.Title level={5} style={{margin: 0, marginBottom: 10}}>Size</Typography.Title>
                    <Radio.Group onChange={handleOnSizeChange} value={size}>
                        <Space direction="vertical">
                            <Radio value={PostSizes.v1x1}>Small Box (1x1)</Radio>
                            <Radio value={PostSizes.v1x2}>Horizontal (1x2)</Radio>
                            <Radio value={PostSizes.v2x1}>Vertical (2x1)</Radio>
                            <Radio value={PostSizes.v2x2}>Medium Box (2x2)</Radio>
                            <Radio value={PostSizes.v4x4}>Large Box (4x4)</Radio>
                        </Space>
                    </Radio.Group>
                </div>
                <div style={{position: 'relative', width: 'calc(100% - 500px)'}}>
                    <DraggableElement
                        onDragStart={handleOnDragStart}
                        onDrag={handleOnDrag}
                        onDragEnd={handleOnDragEnd}
                        showPlaceholder
                        shouldScale
                        size={size}
                    >
                        {type === PostTypes.TEXT ? (
                            <Poster
                                size={size}
                                upload
                            />
                        ): null}
                        {type === PostTypes.TWITTER ? (
                            <XPost />
                        ): null}
                    </DraggableElement>
                </div>
                <div style={{width: 250, position: 'relative'}}>
                    <Typography.Title level={5} style={{margin: 0, marginBottom: 10}}>Type</Typography.Title>
                    <Radio.Group
                        onChange={handleOnTypeChange}
                        value={type}
                    >
                        <Space direction="vertical" defaultValue={PostTypes.TEXT}>
                            <Radio value={PostTypes.TEXT}>Poster</Radio>
                            <Radio value={PostTypes.TWITTER}>x.com</Radio>
                        </Space>
                    </Radio.Group>
                    <CloseOutlined
                        className="slot-configuration-close"
                        onClick={onClose}
                    />
                </div>
            </div>
        </div>
    );
}

export default NewPostConfiguration;
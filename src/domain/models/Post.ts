export enum PostTypes {
    TEXT = 'TEXT',
    POSTER = 'POSTER',
    YOU_TUBE = 'YOU_TUBE',
    TWITTER = 'TWITTER',
    INSTAGRAM = 'INSTAGRAM',
    FACEBOOK = 'FACEBOOK',
    SNAPCHAT = 'SNAPCHAT',
    PINTEREST = 'PINTEREST',
}

export enum PostSizes {
    v1x1 = 'v1x1',
    v1x2 = 'v1x2',
    v2x1 = 'v2x1',
    v2x2 = 'v2x2',
    v4x4 = 'v4x4',
}

interface PostItem {
    size: PostSizes,
    index: number;
    type: PostTypes;
    imageSrc?: string;
    url?: string;
    postId?: string;
    file?: File;
    id?: number;
    boardId?: number;
}

export default PostItem;

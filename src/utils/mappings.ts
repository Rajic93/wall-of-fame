import { PostSizes } from '../domain/models/Post.ts';

export const sizeWidthMapping: Record<string, number> = {
    [PostSizes.v1x1]: 250,
    [PostSizes.v1x2]: 500,
    [PostSizes.v2x1]: 250,
    [PostSizes.v2x2]: 500,
    [PostSizes.v4x4]: 1000,
};
export const sizeHeightMapping: Record<string, number> = {
    [PostSizes.v1x1]: 250,
    [PostSizes.v1x2]: 250,
    [PostSizes.v2x1]: 500,
    [PostSizes.v2x2]: 500,
    [PostSizes.v4x4]: 1000,
};
export const sizePreviewClassMapping: Record<string, string> = {
    [PostSizes.v1x1]: 'none',
    [PostSizes.v1x2]: 'scale-down-2',
    [PostSizes.v2x1]: 'scale-down-2',
    [PostSizes.v2x2]: 'scale-down-2',
    [PostSizes.v4x4]: 'scale-down-4',
}
export const sizeSpanClassMapping: Record<string, string> = {
    [PostSizes.v1x1]: 'none',
    [PostSizes.v1x2]: 'span-1x2',
    [PostSizes.v2x1]: 'span-2x1',
    [PostSizes.v2x2]: 'span-2x2',
    [PostSizes.v4x4]: 'span-4x4',
}
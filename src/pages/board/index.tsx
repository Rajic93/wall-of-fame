import {useState} from "react";
import {PlusCircleOutlined, ZoomInOutlined, ZoomOutOutlined} from "@ant-design/icons";
import './index.css'
import {PostSizes, PostTypes} from "../../templates/Post/types.ts";
import EmptySlot from "../../atoms/EmptySlot";
import flatten from 'lodash/flatten';
import Post from "../../templates/Post";
import {reduce} from "lodash";

interface PostItem {
    size: PostSizes,
    index: number;
    type: PostTypes;
    imageSrc?: string;
}

interface BoardProps {
    onShowNewPostConfiguration?: () => void;
    existingPosts?: PostItem[];
    showControls?: boolean;
    postSize?: PostSizes;
}

const posts: PostItem[] = [
    {
        type: PostTypes.TEXT,
        size: PostSizes.v1x1,
        index: 1,
    },
    {
        type: PostTypes.TEXT,
        size: PostSizes.v1x1,
        index: 5,
    },
    {
        type: PostTypes.POSTER,
        size: PostSizes.v4x4,
        index: 22,
        imageSrc: 'https://plus.unsplash.com/premium_photo-1664474619075-644dd191935f?q=80&w=2969&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    },
    {
        type: PostTypes.POSTER,
        size: PostSizes.v2x2,
        index: 45,
        imageSrc: 'https://plus.unsplash.com/premium_photo-1664474619075-644dd191935f?q=80&w=2969&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    },
];

// Board consists of 1000 blocks of 1x1, by default

const Board = ({
   existingPosts = posts,
   onShowNewPostConfiguration,
   showControls,
   postSize = PostSizes.v4x4,
}: BoardProps) => {
    const [scale, setScale] = useState(1);
    const rowSize = 50;
    const columnSize = 20;
    const matrix = Array(rowSize * columnSize).fill({ empty: true });

    const usedIndices = existingPosts?.reduce((acc, post) => {
        acc[post.index] = post;
        return acc;
    }, {} as Record<number, object>);
    const nAIndices = flatten(existingPosts?.map((post) => {
        const indices = []
        if (post.size === PostSizes.v1x2) {
            indices.push(post.index + 1);
        }
        if (post.size === PostSizes.v2x1) {
            indices.push(post.index + rowSize);
        }
        if (post.size === PostSizes.v2x2) {
            indices.push(post.index + 1, post.index + rowSize, post.index + rowSize + 1);
        }
        if (post.size === PostSizes.v4x4) {
            indices.push(post.index + 1, post.index + 2, post.index + 3);
            indices.push(post.index + rowSize, post.index + rowSize + 1, post.index + rowSize + 2, post.index + rowSize + 3);
            indices.push(post.index + 2 * rowSize, post.index + 2 * rowSize + 1, post.index + 2 * rowSize + 2, post.index + 2 * rowSize + 3);
            indices.push(post.index + 3 * rowSize, post.index + 3 * rowSize + 1, post.index + 3 * rowSize + 2, post.index + 3 * rowSize + 3);
        }
        return indices;
    }));
    const matrixWithoutUsedItems = matrix.map((_, index) => {
        const isNAIndex = nAIndices.includes(index);
        const isPostStart = !!usedIndices[index];
        return {
            isEmpty: !isNAIndex && !isPostStart,
            isNA: isNAIndex,
            isPostStart,
            post: usedIndices[index],
            isUnusable: false,
        };
    })
    const downRightIndices = (index: number) => [
        index + 1, index + 2, index + 3,
        index + rowSize, index + rowSize + 1, index + rowSize + 2, index + rowSize + 3,
        index + 2 * rowSize, index + 2 * rowSize + 1, index + 2 * rowSize + 2, index + 2 * rowSize + 3,
        index + 3 * rowSize, index + 3 * rowSize + 1, index + 3 * rowSize + 2, index + 3 * rowSize + 3,
    ];
    const upRightIndices = (index: number) => [
            index + 1, index + 2, index + 3,
            index - rowSize, index - rowSize + 1, index - rowSize + 2, index - rowSize + 3,
            index - 2 * rowSize, index - 2 * rowSize + 1, index - 2 * rowSize + 2, index - 2 * rowSize + 3,
            index - 3 * rowSize, index - 3 * rowSize + 1, index - 3 * rowSize + 2, index - 3 * rowSize + 3,
        ];
    const downLeftIndices = (index: number) => [
        index - 1, index - 2, index - 3,
        index + rowSize, index + rowSize - 1, index + rowSize - 2, index + rowSize - 3,
        index + 2 * rowSize, index + 2 * rowSize - 1, index + 2 * rowSize - 2, index + 2 * rowSize - 3,
        index + 3 * rowSize, index + 3 * rowSize - 1, index + 3 * rowSize - 2, index + 3 * rowSize - 3,
    ];
    const upLeftIndices = (index: number) => [
        index - 1, index - 2, index - 3,
        index - rowSize, index - rowSize - 1, index - rowSize - 2, index - rowSize - 3,
        index - 2 * rowSize, index - 2 * rowSize - 1, index - 2 * rowSize - 2, index - 2 * rowSize - 3,
        index - 3 * rowSize, index - 3 * rowSize - 1, index - 3 * rowSize - 2, index - 3 * rowSize - 3,
    ];
    const isItemValid = (item: Record<string, object | boolean>) => item.isEmpty && !item.isNA && !item.isPostStart;
    const isUsableCell1x2 = (index: number) => {
        // first row
        if (index % rowSize === 0) {
            const item = matrixWithoutUsedItems[index + 1]
            return isItemValid(item);
        }
        // last row
        if (index === rowSize * columnSize - 1) {
            const item = matrixWithoutUsedItems[index - 1]
            return isItemValid(item);
        }
        // middle rows
        const itemRight = matrixWithoutUsedItems[index + 1];
        const itemLeft = matrixWithoutUsedItems[index - 1];
        const leftIsValid = isItemValid(itemLeft);
        const rightIsValid = isItemValid(itemRight);
        return leftIsValid || rightIsValid;
    }
    const isUsableCell2x1 = (index: number) => {
        // first row
        if (index < rowSize) {
            const item = matrixWithoutUsedItems[index + rowSize];
            return isItemValid(item);
        }
        // last row
        if (index / rowSize >= columnSize - 1) {
            const item = matrixWithoutUsedItems[index - rowSize];
            return isItemValid(item);
        }
        // middle rows
        const itemUp = matrixWithoutUsedItems[index - rowSize];
        const itemDown = matrixWithoutUsedItems[index + rowSize];
        const upIsValid = isItemValid(itemUp);
        const downIsValid = isItemValid(itemDown);
        return upIsValid || downIsValid;
    }
    const isUsableCell2x2 = (index: number) => {
        const itemUp = matrixWithoutUsedItems[index - rowSize];
        const itemDown = matrixWithoutUsedItems[index + rowSize];
        const itemLeft = matrixWithoutUsedItems[index - 1];
        const itemRight = matrixWithoutUsedItems[index + 1];
        const itemDiagonalRightBottom = matrixWithoutUsedItems[index + rowSize + 1];
        const itemDiagonalLeftBottom = matrixWithoutUsedItems[index + rowSize - 1];
        const itemDiagonalRightTop = matrixWithoutUsedItems[index - rowSize + 1];
        const itemDiagonalLeftTop = matrixWithoutUsedItems[index - rowSize - 1];
        // first row
        if (index < rowSize) {
            if (index % rowSize === 0) {
                return isItemValid(itemRight) && isItemValid(itemDown) && isItemValid(itemDiagonalRightBottom);
            }
            if (index % rowSize === columnSize - 1) {
                return isItemValid(itemLeft) && isItemValid(itemDown) && isItemValid(itemDiagonalLeftBottom);
            }
            return (isItemValid(itemLeft) || isItemValid(itemRight)) && isItemValid(itemDown) && (isItemValid(itemDiagonalRightBottom) || isItemValid(itemDiagonalLeftBottom));
        }
        // last row
        if (index / rowSize >= columnSize - 1) {
            if (index % rowSize === 0) {
                return isItemValid(itemRight) && isItemValid(itemUp) && isItemValid(itemDiagonalRightTop);
            }
            if (index % rowSize === columnSize - 1) {
                return isItemValid(itemLeft) && isItemValid(itemUp) && isItemValid(itemDiagonalLeftTop);
            }
            return (isItemValid(itemLeft) || isItemValid(itemRight)) && isItemValid(itemUp) && (isItemValid(itemDiagonalRightTop) || isItemValid(itemDiagonalLeftTop));
        }
        // middle rows
        if (index % rowSize === 0) {
            return (isItemValid(itemUp) || isItemValid(itemDown)) && isItemValid(itemRight) && (isItemValid(itemDiagonalRightTop) || isItemValid(itemDiagonalRightBottom));
        }
        if (index % rowSize === columnSize - 1) {
            return (isItemValid(itemUp) || isItemValid(itemDown)) && isItemValid(itemLeft) && (isItemValid(itemDiagonalLeftTop) || isItemValid(itemDiagonalLeftBottom));
        }
        return (isItemValid(itemUp) && isItemValid(itemLeft) && isItemValid(itemDiagonalLeftTop))
            || (isItemValid(itemUp) && isItemValid(itemRight) && isItemValid(itemDiagonalRightTop))
            || (isItemValid(itemDown) && isItemValid(itemLeft) && isItemValid(itemDiagonalLeftBottom))
            || (isItemValid(itemDown) && isItemValid(itemRight) && isItemValid(itemDiagonalRightBottom));
    }
    const isUsableCell4x4 = (index: number) => {
        const validateIndices = (indices: number[]) => indices.every((index) =>isItemValid(matrixWithoutUsedItems[index]));
        // first 4 rows
        if (index < 4 * rowSize) {
            if (index % rowSize < 4) {
                return { isUsable: validateIndices(downRightIndices(index)), indices: downRightIndices(index) };
            }
            if (index % rowSize > columnSize - 4) {
                return { isUsable: validateIndices(downLeftIndices(index)), indices: downLeftIndices(index) };
            }
            if (validateIndices(downRightIndices(index)) || validateIndices(downLeftIndices(index))) {
                return { isUsable: true, indices: validateIndices(downRightIndices(index)) ? downRightIndices(index) : downLeftIndices(index) };
            }
            return { isUsable: false, indices: [] };
        }
        // last 4 rows
        if (index / 4 * rowSize >= columnSize - 1) {
            if (index % rowSize < 4) {
                return { isUsable: validateIndices(upRightIndices(index)), indices: upRightIndices(index) };
            }
            if (index % rowSize > columnSize - 4) {
                return { isUsable: validateIndices(upLeftIndices(index)), indices: upLeftIndices(index) };
            }
            if (validateIndices(upRightIndices(index)) || validateIndices(upLeftIndices(index))) {
                return { isUsable: true, indices: validateIndices(upRightIndices(index)) ? upRightIndices(index) : upLeftIndices(index) };
            }
            return { isUsable: false, indices: [] };
        }
        // middle rows
        if (index % rowSize === 0) {
            if (validateIndices(downRightIndices(index)) || validateIndices(upRightIndices(index))) {
                return { isUsable: true, indices: validateIndices(downRightIndices(index)) ? downRightIndices(index) : upRightIndices(index) };
            }
            return { isUsable: false, indices: [] };
        }
        if (index % rowSize === columnSize - 1) {
            if (validateIndices(downLeftIndices(index)) || validateIndices(downLeftIndices(index))) {
                return { isUsable: true, indices: validateIndices(downLeftIndices(index)) ? downLeftIndices(index) : downLeftIndices(index) };
            }
            return { isUsable: false, indices: [] };
        }

        if (!(validateIndices(downRightIndices(index)) || validateIndices(upRightIndices(index)) || validateIndices(downLeftIndices(index)) || validateIndices(upLeftIndices(index)))) {
            return { isUsable: true, indices: [] };
        }
        if (validateIndices(downRightIndices(index))) {
            return { isUsable: true, indices: downRightIndices(index) };
        }
        if (validateIndices(upRightIndices(index))) {
            return { isUsable: true, indices: upRightIndices(index) };
        }
        if (validateIndices(downLeftIndices(index))) {
            return { isUsable: true, indices: downLeftIndices(index) };
        }
        return { isUsable: true, indices: upLeftIndices(index) };
    }
    const isUsableCell = (index: number) => {
        if (postSize === PostSizes.v1x2) {
            return { isUsable: isUsableCell1x2(index), indices: [] };
        }
        if (postSize === PostSizes.v2x1) {
            return { isUsable: isUsableCell2x1(index), indices: [] };
        }
        if (postSize === PostSizes.v2x2) {
            return { isUsable: isUsableCell2x2(index), indices: [] };
        }
        if (postSize === PostSizes.v4x4) {
            return isUsableCell4x4(index);
        }
        return { isUsable: true, indices: [] };
    }
    const matrixWithoutNotApplicableItems = matrixWithoutUsedItems.map((cell, index) => {
        const { isUsable, indices } = isUsableCell(index);
        if (postSize === PostSizes.v4x4 && isUsable && !cell.isUnusable) {
            // patch all indices that are usable if not patched already
            for (const index1 of indices) {
                matrixWithoutUsedItems[index1].isUnusable = !isUsable;
            }
        }
        cell.isUnusable = !isUsable;
        return cell;
    })
    const resolvedMatrix = matrixWithoutNotApplicableItems.filter((cell) => !cell.isNA);
    const onZoom = (multiplier = 1) => {
        const board = document.getElementById('board')
        if (!board) {
            return;
        }

        const nextScale = scale * multiplier;
        board.style.transform = `scale(${nextScale})`;
        setScale(nextScale);
    }
    const handleOnZoomIn = () => onZoom(1.1);
    const handleOnZoomOut = () => onZoom(0.9);

    const handleOnShowNewPostConfiguration = () => {
        if (typeof onShowNewPostConfiguration === 'function') {
            onShowNewPostConfiguration();
        }
    }

    return (
        <>
            <div
                id="board"
                className="board"
            >
                {resolvedMatrix.map((cell, index) => {
                    if (cell.isPostStart) {
                        return <Post {...cell.post as PostItem} />;
                    }
                    if (cell.isUnusable) {
                        return <div style={{backgroundColor: 'mediumvioletred'}}>Unusable</div>
                    }
                    if (cell.isEmpty) {
                        return (
                            <EmptySlot
                                // onDragEnd={() => handleDragOver(index)}
                                key={index}
                                shouldShow
                                size={PostSizes.v1x1}
                                // shouldShow={shouldShowEmptySlots}
                            />
                        );
                    }
                    return null;
                })}
            </div>

            {showControls ? (
                <div
                    className="controls"
                >
                    <PlusCircleOutlined
                        onClick={handleOnShowNewPostConfiguration}
                    />
                    <ZoomInOutlined
                        onClick={handleOnZoomIn}
                    />
                    <ZoomOutOutlined
                        onClick={handleOnZoomOut}
                    />
                </div>
            ) : null}
        </>
    );
}

export default Board;

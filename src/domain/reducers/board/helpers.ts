import flatten from "lodash/flatten";
import PostItem, { PostSizes } from '../../models/Post.ts';
import { BoardCell } from './index.ts';

const downRightIndices = (rowSize: number, index: number) => [
    index + 1, index + 2, index + 3,
    index + rowSize, index + rowSize + 1, index + rowSize + 2, index + rowSize + 3,
    index + 2 * rowSize, index + 2 * rowSize + 1, index + 2 * rowSize + 2, index + 2 * rowSize + 3,
    index + 3 * rowSize, index + 3 * rowSize + 1, index + 3 * rowSize + 2, index + 3 * rowSize + 3,
];

const upRightIndices = (rowSize: number, index: number) => [
    index + 1, index + 2, index + 3,
    index - rowSize, index - rowSize + 1, index - rowSize + 2, index - rowSize + 3,
    index - 2 * rowSize, index - 2 * rowSize + 1, index - 2 * rowSize + 2, index - 2 * rowSize + 3,
    index - 3 * rowSize, index - 3 * rowSize + 1, index - 3 * rowSize + 2, index - 3 * rowSize + 3,
];

const downLeftIndices = (rowSize: number, index: number) => [
    index - 1, index - 2, index - 3,
    index + rowSize, index + rowSize - 1, index + rowSize - 2, index + rowSize - 3,
    index + 2 * rowSize, index + 2 * rowSize - 1, index + 2 * rowSize - 2, index + 2 * rowSize - 3,
    index + 3 * rowSize, index + 3 * rowSize - 1, index + 3 * rowSize - 2, index + 3 * rowSize - 3,
];

const upLeftIndices = (rowSize: number, index: number) => [
    index - 1, index - 2, index - 3,
    index - rowSize, index - rowSize - 1, index - rowSize - 2, index - rowSize - 3,
    index - 2 * rowSize, index - 2 * rowSize - 1, index - 2 * rowSize - 2, index - 2 * rowSize - 3,
    index - 3 * rowSize, index - 3 * rowSize - 1, index - 3 * rowSize - 2, index - 3 * rowSize - 3,
];

const isItemValid = (item: BoardCell) => item.isEmpty && !item.isNA && !item.isPostStart;

const isUsableCell1x2 = (matrix: BoardCell[], rowSize: number, columnSize: number, index: number) => {
    // first row
    if (index % rowSize === 0) {
        return { isUsable: isItemValid(matrix[index + 1]), indices: [] };
    }
    // last row
    if (index === rowSize * columnSize - 1) {
        return { isUsable: isItemValid(matrix[index - 1]), indices: [] };
    }
    // middle rows
    return { isUsable: isItemValid(matrix[index - 1]) || isItemValid(matrix[index + 1]), indices: [] };
}

const isUsableCell2x1 = (matrix: BoardCell[], rowSize: number, columnSize: number, index: number) => {
    // first row
    if (index < rowSize) {
        return { isUsable: isItemValid(matrix[index + rowSize]), indices: [] };
    }
    // last row
    if (index / rowSize >= columnSize - 1) {
        return { isUsable: isItemValid(matrix[index - rowSize]), indices: [] };
    }
    // middle rows
    return { isUsable: isItemValid(matrix[index - rowSize]) || isItemValid(matrix[index + rowSize]), indices: [] };
}

const isUsableCell2x2 = (matrix: BoardCell[], rowSize: number, columnSize: number, index: number) => {
    const itemUp = matrix[index - rowSize];
    const itemDown = matrix[index + rowSize];
    const itemLeft = matrix[index - 1];
    const itemRight = matrix[index + 1];
    const itemDiagonalRightBottom = matrix[index + rowSize + 1];
    const itemDiagonalLeftBottom = matrix[index + rowSize - 1];
    const itemDiagonalRightTop = matrix[index - rowSize + 1];
    const itemDiagonalLeftTop = matrix[index - rowSize - 1];
    // first row
    if (index < rowSize) {
        if (index % rowSize === 0) {
            return { isUsable: isItemValid(itemRight) && isItemValid(itemDown) && isItemValid(itemDiagonalRightBottom), indices: [] };
        }
        if (index % rowSize === columnSize - 1) {
            return { isUsable: isItemValid(itemLeft) && isItemValid(itemDown) && isItemValid(itemDiagonalLeftBottom), indices: [] };
        }
        return { isUsable: (isItemValid(itemLeft) || isItemValid(itemRight)) && isItemValid(itemDown) && (isItemValid(itemDiagonalRightBottom) || isItemValid(itemDiagonalLeftBottom)), indices: [] };
    }
    // last row
    if (index / rowSize >= columnSize - 1) {
        if (index % rowSize === 0) {
            return { isUsable: isItemValid(itemRight) && isItemValid(itemUp) && isItemValid(itemDiagonalRightTop), indices: [] };
        }
        if (index % rowSize === columnSize - 1) {
            return { isUsable: isItemValid(itemLeft) && isItemValid(itemUp) && isItemValid(itemDiagonalLeftTop), indices: [] };
        }
        return { isUsable: (isItemValid(itemLeft) || isItemValid(itemRight)) && isItemValid(itemUp) && (isItemValid(itemDiagonalRightTop) || isItemValid(itemDiagonalLeftTop)), indices: [] };
    }
    // middle rows
    if (index % rowSize === 0) {
        return { isUsable: (isItemValid(itemUp) || isItemValid(itemDown)) && isItemValid(itemRight) && (isItemValid(itemDiagonalRightTop) || isItemValid(itemDiagonalRightBottom)), indices: [] };
    }
    if (index % rowSize === columnSize - 1) {
        return { isUsable: (isItemValid(itemUp) || isItemValid(itemDown)) && isItemValid(itemLeft) && (isItemValid(itemDiagonalLeftTop) || isItemValid(itemDiagonalLeftBottom)), indices: [] };
    }
    return { isUsable: (isItemValid(itemUp) && isItemValid(itemLeft) && isItemValid(itemDiagonalLeftTop))
        || (isItemValid(itemUp) && isItemValid(itemRight) && isItemValid(itemDiagonalRightTop))
        || (isItemValid(itemDown) && isItemValid(itemLeft) && isItemValid(itemDiagonalLeftBottom))
        || (isItemValid(itemDown) && isItemValid(itemRight) && isItemValid(itemDiagonalRightBottom)), indices: [] };
}

const isUsableCell4x4 = (matrix: BoardCell[], rowSize: number, columnSize: number, index: number) => {
    const validateIndices = (indices: number[]) => indices.every((index) => isItemValid(matrix[index]));
    // first 4 rows
    if (index < 4 * rowSize) {
        if (index % rowSize < 4) {
            return { isUsable: validateIndices(downRightIndices(rowSize, index)), indices: downRightIndices(rowSize, index) };
        }
        if (index % rowSize > columnSize - 4) {
            return { isUsable: validateIndices(downLeftIndices(rowSize, index)), indices: downLeftIndices(rowSize, index) };
        }
        if (validateIndices(downRightIndices(rowSize, index)) || validateIndices(downLeftIndices(rowSize, index))) {
            return { isUsable: true, indices: validateIndices(downRightIndices(rowSize, index)) ? downRightIndices(rowSize, index) : downLeftIndices(rowSize, index) };
        }
        return { isUsable: false, indices: [] };
    }
    // last 4 rows
    if (index / 4 * rowSize >= columnSize - 1) {
        if (index % rowSize < 4) {
            return { isUsable: validateIndices(upRightIndices(rowSize, index)), indices: upRightIndices(rowSize, index) };
        }
        if (index % rowSize > columnSize - 4) {
            return { isUsable: validateIndices(upLeftIndices(rowSize, index)), indices: upLeftIndices(rowSize, index) };
        }
        if (validateIndices(upRightIndices(rowSize, index)) || validateIndices(upLeftIndices(rowSize, index))) {
            return { isUsable: true, indices: validateIndices(upRightIndices(rowSize, index)) ? upRightIndices(rowSize, index) : upLeftIndices(rowSize, index) };
        }
        return { isUsable: false, indices: [] };
    }
    // middle rows
    if (index % rowSize === 0) {
        if (validateIndices(downRightIndices(rowSize, index)) || validateIndices(upRightIndices(rowSize, index))) {
            return { isUsable: true, indices: validateIndices(downRightIndices(rowSize, index)) ? downRightIndices(rowSize, index) : upRightIndices(rowSize, index) };
        }
        return { isUsable: false, indices: [] };
    }
    if (index % rowSize === columnSize - 1) {
        if (validateIndices(downLeftIndices(rowSize, index)) || validateIndices(downLeftIndices(rowSize, index))) {
            return { isUsable: true, indices: validateIndices(downLeftIndices(rowSize, index)) ? downLeftIndices(rowSize, index) : downLeftIndices(rowSize, index) };
        }
        return { isUsable: false, indices: [] };
    }

    if (!(validateIndices(downRightIndices(rowSize, index)) || validateIndices(upRightIndices(rowSize, index)) || validateIndices(downLeftIndices(rowSize, index)) || validateIndices(upLeftIndices(rowSize, index)))) {
        return { isUsable: true, indices: [] };
    }
    if (validateIndices(downRightIndices(rowSize, index))) {
        return { isUsable: true, indices: downRightIndices(rowSize, index) };
    }
    if (validateIndices(upRightIndices(rowSize, index))) {
        return { isUsable: true, indices: upRightIndices(rowSize, index) };
    }
    if (validateIndices(downLeftIndices(rowSize, index))) {
        return { isUsable: true, indices: downLeftIndices(rowSize, index) };
    }
    return { isUsable: true, indices: upLeftIndices(rowSize, index) };
}

export const isUsableCell = (matrix: BoardCell[], rowSize: number, columnSize: number, cellSize: PostSizes, index: number) => {
    const handlerByCellSize: Record<PostSizes, (matrix: BoardCell[], rowSize: number, columnSize: number, index: number) => {
        isUsable: boolean;
        indices: number[];
    }> = {
        [PostSizes.v1x1]: () => ({ isUsable: true, indices: [] }),
        [PostSizes.v1x2]: isUsableCell1x2,
        [PostSizes.v2x1]: isUsableCell2x1,
        [PostSizes.v2x2]: isUsableCell2x2,
        [PostSizes.v4x4]: isUsableCell4x4,
    };
    return handlerByCellSize[cellSize](matrix, rowSize, columnSize, index);
}

export const mapMatrix = (matrix: BoardCell[], usedCells: PostItem[] = [], cellSize: PostSizes, rowSize: number, columnSize: number,) => {
    const usedIndices = usedCells?.reduce((acc, post) => {
        acc[post.index] = post;
        return acc;
    }, {} as Record<number, PostItem>);
    // take new post size into account and remove all that are not applicable
    const nAIndices = flatten(usedCells?.map((post) => {
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
    // and remove them from the matrix
    const matrixWithoutUsedItems = matrix.map((cell, index) => {
        const updatedCell: BoardCell = {...cell};
        const isNAIndex = nAIndices.includes(index);
        const isPostStart = usedIndices ? typeof usedIndices[index] === 'object' : false;
        const isSelected = !!usedIndices && typeof usedIndices[index] === 'object';
        updatedCell.isEmpty = !isNAIndex && !isPostStart;
        updatedCell.isNA = isNAIndex;
        updatedCell.isPostStart = isPostStart;
        updatedCell.post = usedIndices ? usedIndices[index] as PostItem : null;
        updatedCell.isUnusable = false;
        updatedCell.isSelected = isSelected;
        return updatedCell;
    })

    // take new post size into account and remove all that are not applicable
    return matrixWithoutUsedItems.map((cell, index) => {
        const { isUsable, indices } = isUsableCell(matrixWithoutUsedItems, rowSize, columnSize, cellSize, index);
        if (cellSize === PostSizes.v4x4 && isUsable && !cell.isUnusable) {
            // patch all indices that are usable if not patched already
            for (const index1 of indices) {
                matrixWithoutUsedItems[index1].isUnusable = !isUsable;
            }
        }
        cell.isUnusable = !isUsable;
        return cell;
    })
}

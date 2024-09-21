import isNil from 'lodash/isNil';
import PostItem, { PostSizes, PostTypes } from '../../models/Post.ts';
import { BoardActionObject, BoardActionsTypes, BoardModel } from '../../actions/board.ts';
import { mapMatrix } from './helpers.ts';

export type NewPostContent = Record<string, string | number | boolean | Record<string, string | number | boolean> | File> | null;

export interface BoardState {
    cellSize: PostSizes;
    postType: PostTypes;
    boardScale: number;
    isPostFormOpen: boolean;
    rowSize: number;
    columnSize: number;
    matrix: BoardCell[];
    usedCells: PostItem[];
    selectedCells: number[];
    content: NewPostContent;
    postFormStep: PostFormStep;
    board: BoardModel | null;
}

export interface BoardCell {
    isEmpty: boolean;
    isNA: boolean;
    isPostStart: boolean,
    post: PostItem | null;
    isUnusable: boolean;
    isSelected: boolean;
}

export enum PostFormStep {
    NONE,
    TYPE_STEP,
    CONTENT_STEP,
    SIZE_STEP,
    SLOT_STEP,
}

export const typeToSizeFilter: Partial<Record<PostTypes, PostSizes[]>> = {
    [PostTypes.POSTER]: [PostSizes.v1x1],
    [PostTypes.TWITTER]: [PostSizes.v2x1],
    [PostTypes.INSTAGRAM]: [PostSizes.v2x1],
    [PostTypes.FACEBOOK]: [PostSizes.v2x1],
    [PostTypes.YOU_TUBE]: [PostSizes.v2x2, PostSizes.v4x4],
    [PostTypes.PINTEREST]: [PostSizes.v1x1, PostSizes.v2x1, PostSizes.v2x2, PostSizes.v4x4],
};

export const initialBoardState: BoardState = {
    cellSize: typeToSizeFilter[PostTypes.TWITTER] ? typeToSizeFilter[PostTypes.TWITTER][0] : PostSizes.v1x1,
    postType: PostTypes.TWITTER,
    boardScale: 1,
    isPostFormOpen: false,
    rowSize: 50,
    columnSize: 20,
    matrix: Array(50 * 20).fill({ isEmpty: true }),
    usedCells: [],
    selectedCells: [],
    content: null,
    postFormStep: PostFormStep.NONE,
    board: null,
};

export const boardReducer = (state: BoardState, action: BoardActionObject): BoardState => {
    switch (action.type) {
        case BoardActionsTypes.ChangeScale: {
            const newState = {...state};

            const scale = (action.boardScale || 1) * state.boardScale;
            newState.boardScale = scale > 0.15 ? scale : 0.15;

            return newState;
        }
        case BoardActionsTypes.ChangeSize: {
            const newState = {...state};

            newState.cellSize = action.cellSize || state.cellSize;
            newState.matrix = mapMatrix(
                newState.matrix,
                newState.usedCells,
                newState.cellSize,
                newState.rowSize,
                newState.columnSize
            );

            return newState;
        }
        case BoardActionsTypes.ChangeType: {
            const newState = {...state};

            newState.postType = action.postType || state.postType;
            const sizes = typeToSizeFilter[newState.postType];
            if (sizes && sizes.length && sizes[0] !== newState.cellSize) {
                newState.cellSize = sizes[0];
                newState.matrix = mapMatrix(
                    newState.matrix,
                    newState.usedCells,
                    newState.cellSize,
                    newState.rowSize,
                    newState.columnSize
                );
            }

            return newState;
        }
        case BoardActionsTypes.SelectCell: {
            const newState = {...state};

            newState.selectedCells = action.selectedCells || state.selectedCells;
            newState.matrix = state.matrix.map((cell, index) => ({
                ...cell,
                isSelected: newState.selectedCells.includes(index),
            }));

            return newState;
        }
        case BoardActionsTypes.NextFormStep: {
            const newState = {...state};

            const nextStepMappings = {
                [PostFormStep.NONE]: PostFormStep.TYPE_STEP,
                [PostFormStep.TYPE_STEP]: PostFormStep.CONTENT_STEP,
                [PostFormStep.CONTENT_STEP]: PostFormStep.SIZE_STEP,
                [PostFormStep.SIZE_STEP]: PostFormStep.SLOT_STEP,
                [PostFormStep.SLOT_STEP]: PostFormStep.SLOT_STEP,
            };

            newState.postFormStep = nextStepMappings[state.postFormStep];
            if (newState.postFormStep === PostFormStep.TYPE_STEP && !state.isPostFormOpen) {
                newState.isPostFormOpen = true;
            }
            if (newState.postFormStep === PostFormStep.SLOT_STEP && state.isPostFormOpen) {
                newState.isPostFormOpen = false;
            }

            return newState;
        }
        case BoardActionsTypes.PrevFormStep: {
            const newState = {...state};

            const prevStepMappings = {
                [PostFormStep.SLOT_STEP]: PostFormStep.SIZE_STEP,
                [PostFormStep.SIZE_STEP]: PostFormStep.CONTENT_STEP,
                [PostFormStep.CONTENT_STEP]: PostFormStep.TYPE_STEP,
                [PostFormStep.TYPE_STEP]: PostFormStep.NONE,
                [PostFormStep.NONE]: PostFormStep.NONE,
            };

            newState.postFormStep = prevStepMappings[state.postFormStep];
            if (newState.postFormStep === PostFormStep.SIZE_STEP && !state.isPostFormOpen) {
                newState.isPostFormOpen = true;
            }
            if (newState.postFormStep === PostFormStep.NONE && state.isPostFormOpen) {
                newState.isPostFormOpen = false;
            }

            return newState;
        }
        case BoardActionsTypes.SetFormStep: {
            const newState = {...state};

            newState.postFormStep = action.postFormStep || state.postFormStep;
            if (newState.postFormStep !== PostFormStep.SLOT_STEP && !state.isPostFormOpen) {
                newState.isPostFormOpen = true;
            }

            return newState;
        }
        case BoardActionsTypes.TogglePostForm: {
            const newState = {...state};

            newState.isPostFormOpen = !isNil(action.isPostFormOpen) ? action.isPostFormOpen : !state.isPostFormOpen;
            newState.postFormStep = newState.isPostFormOpen ? PostFormStep.TYPE_STEP : PostFormStep.NONE;
            return newState;
        }
        case BoardActionsTypes.SetContent: {
            const newState = {...state};

            newState.content = action.content || state.content;

            return newState;
        }
        case BoardActionsTypes.SetBoard: {
            const newState = {...state};

            newState.board = action.board || state.board;

            return newState;
        }
        case BoardActionsTypes.SetUsedCells: {
            const newState = {...state};

            newState.usedCells = action.usedCells || state.usedCells;
            newState.matrix = mapMatrix(
                newState.matrix,
                newState.usedCells,
                newState.cellSize,
                newState.rowSize,
                newState.columnSize
            );

            return newState;
        }
        default:
            return state;
    }
}
import PostItem, { PostSizes, PostTypes } from '../models/Post.ts';
import { BoardState, NewPostContent, PostFormStep } from '../reducers/board';

export enum BoardActionsTypes {
    ChangeSize = 'CHANGE_SIZE',
    ChangeType = 'CHANGE_TYPE',
    SelectCell = 'SELECT_CELL',
    ChangeScale = 'CHANGE_SCALE',
    TogglePostForm = 'TOGGLE_POST_FORM',
    SetUsedCells = 'SET_USED_CELLS',
    SetContent = 'SET_CONTENT',
    NextFormStep = 'NEXT_FORM_STEP',
    PrevFormStep = 'PREV_FORM_STEP',
    SetFormStep = 'SET_FORM_STEP',
    SetBoard = 'SET_BOARD',
}

export type BoardActionObject = Partial<BoardState> & { type: BoardActionsTypes };
export type BoardModel = Record<string, boolean | string | number>;

export type BoardActions = {
    onZoom: (coefficient: number) => void;
    toggleNewPostForm: (shouldOpen?: boolean) => void;
    setUsedItems: (usedCells: PostItem[]) => void;
    setSelectedCells: (selectedCells: number[]) => void;
    setCellSize: (cellSize: PostSizes) => void;
    setPostType: (postType: PostTypes) => void;
    setContent: (content: NewPostContent) => void;
    onNextFormStep: () => void;
    onPrevFormStep: () => void;
    setFormStep: (postFormStep: PostFormStep) => void;
    setBoard: (board: BoardModel) => void;
};

const boardActionsFactory = (dispatch: (param: BoardActionObject) => void): BoardActions => {
    const onZoom = (coefficient: number) => dispatch({
        type: BoardActionsTypes.ChangeScale,
        boardScale: coefficient > 0 ? 1.1 : 0.9,
    })

    const toggleNewPostForm = (shouldOpen: boolean = false) => dispatch({
        type: BoardActionsTypes.TogglePostForm,
        isPostFormOpen: shouldOpen,
    });

    const setUsedItems = (usedCells: PostItem[]) => dispatch({
        type: BoardActionsTypes.SetUsedCells,
        usedCells,
    });

    const setSelectedCells = (selectedCells: number[]) => dispatch({
        type: BoardActionsTypes.SelectCell,
        selectedCells,
    });

    const setCellSize = (cellSize: PostSizes) => dispatch({
        type: BoardActionsTypes.ChangeSize,
        cellSize,
    });

    const setPostType = (postType: PostTypes) => dispatch({
        type: BoardActionsTypes.ChangeType,
        postType,
    });

    const setContent = (content: NewPostContent) => dispatch({
        type: BoardActionsTypes.SetContent,
        content,
    });

    const onNextFormStep = () => dispatch({
        type: BoardActionsTypes.NextFormStep,
    });

    const onPrevFormStep = () => dispatch({
        type: BoardActionsTypes.PrevFormStep,
    });

    const setFormStep = (postFormStep: PostFormStep) => dispatch({
        type: BoardActionsTypes.SetFormStep,
        postFormStep,
    });

    const setBoard = (board: BoardModel) => dispatch({
        type: BoardActionsTypes.SetBoard,
        board,
    });

    return {
        onZoom,
        toggleNewPostForm,
        setUsedItems,
        setSelectedCells,
        setCellSize,
        setPostType,
        setContent,
        onNextFormStep,
        onPrevFormStep,
        setFormStep,
        setBoard,
    };
}

export default boardActionsFactory;

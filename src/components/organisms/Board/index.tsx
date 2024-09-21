import { useContext, useEffect } from 'react';
import PostItem from '../../../domain/models/Post.ts';
import useBoard from '../../../domain/hooks/board.ts';
import usePosts from '../../../domain/hooks/posts.ts';
import useUserData from '../../../domain/hooks/userProfile.ts';
import { PostFormStep } from '../../../domain/reducers/board';
import ErrorBoundary from '../../atoms/ErrorBoundary';
import AuthContext from '../../context/auth.context.ts';
import BoardContext, { BoardContextType } from '../../context/board.context.ts';
import Post from '../../templates/Post';
import { PostModes } from '../../templates/Post/types.ts';
import NewPostConfiguration from '../NewPostConfiguration';
import EmptySlot from './components/EmptySlot';
import UnusableSlot from './components/UnusableSlot';
import BackButton from './components/BackButton';
import BoardTitle from './components/BoardTitle';
import BoardControls from './components/BoardControls';
import './index.css';

export interface BoardPageProps {
    id?: number;
}

const BoardPage = ({ id }: BoardPageProps) => {
    const {
        state,
        actions,
    } = useBoard();
    const { fetchPosts, savePost } = usePosts();
    const { fetchBoardById } = useUserData();
    const authContext = useContext(AuthContext);
    const context: BoardContextType = { state, actions };

    const isCreationModeEnabled = !!authContext.session && (
        !state.board?.isReadOnly ||
        state.board?.isReadOnly && authContext.session?.user.id !== state.board?.userI);
    const isCreationMode = state.isPostFormOpen;

    useEffect(() => {
        if (!id) {
            return;
        }
        fetchPosts(id).then((fetchedPosts) => actions.setUsedItems(fetchedPosts as PostItem[]));
    }, []);

    useEffect(() => {
        if (!state.board && id) {
            fetchBoardById(id)
                .then((board) => {
                    if (actions && board) {
                        actions.setBoard(board)
                    }
                })
        }
    }, []);

    useEffect(() => {
        const board = document.getElementById('board')
        if (!board) {
            return;
        }

        board.style.transform = `scale(${state.boardScale})`;
    }, [state.boardScale]);

    const onConfirm = () => {
        if (state.selectedCells.length && state.content) {
            savePost({ type: state.postType, size: state.cellSize, ...state.content, index: state.selectedCells[0], boardId: state.board?.id } as PostItem)
                .then((data) => {
                    actions.toggleNewPostForm()
                    return data;
                })
                .then((newPosts) => actions.setUsedItems(newPosts as PostItem[]));
        }
    };
    console.log(Boolean(isCreationModeEnabled && isCreationMode),{ isCreationMode, isCreationModeEnabled})

    return (
        <BoardContext.Provider value={context}>
            <NewPostConfiguration
                onConfirm={onConfirm}
            />
            <BackButton />
            <BoardTitle text={state.board?.title.toString()} />

            <div
                id="board"
                className="board"
            >
                {state.matrix.map((cell, index) => {
                    if (cell.isPostStart) {
                        return (
                            <ErrorBoundary>
                                <Post
                                    {...cell.post as PostItem}
                                    mode={!isCreationModeEnabled ? PostModes.VIEW : PostModes.EDIT}
                                />
                            </ErrorBoundary>
                        );
                    }
                    if (cell.isUnusable) {
                        return (
                            <UnusableSlot
                                isHidden={!isCreationMode}
                            />
                        );
                    }
                    if (cell.isEmpty) {
                        return (
                            <EmptySlot
                                key={index}
                                size={state.cellSize}
                                onSelect={() => isCreationMode && actions?.setSelectedCells([index])}
                                isSelected={cell.isSelected}
                                shouldShow={state.postFormStep !== PostFormStep.NONE}
                            />
                        );
                    }
                    return null;
                })}
            </div>

            <BoardControls
                enabled
                isCreationEnabled={Boolean(isCreationModeEnabled)}
                isCreationMode={Boolean(isCreationMode)}
                onToggleNewPostForm={(isOpen) => actions?.toggleNewPostForm(isOpen)}
                onZoom={(coefficient) => actions?.onZoom(coefficient)}
            />
        </BoardContext.Provider>
    )
}

export default BoardPage;

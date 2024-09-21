import { useReducer } from 'react';
import { boardReducer, initialBoardState } from '../reducers/board';
import boardActionsFactory from '../actions/board.ts';

const useBoard = () => {
    const [state, dispatch] = useReducer(boardReducer, initialBoardState);

    const actions = boardActionsFactory(dispatch);

    return {
        state,
        actions,
    };
}

export default useBoard;
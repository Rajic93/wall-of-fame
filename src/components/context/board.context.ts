import { createContext } from 'react';
import { BoardState, initialBoardState} from '../../domain/reducers/board';
import { BoardActions } from '../../domain/actions/board.ts';

export type BoardContextType = {
    state: BoardState;
    actions?: BoardActions
}

export const BoardContext = createContext<BoardContextType>({ state: initialBoardState });

export default BoardContext;

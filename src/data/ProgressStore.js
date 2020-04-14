import {ReduceStore} from 'flux/utils';
import PupilDispatcher from './PupilDispatcher';
import ProgressActionTypes from './ProgressActionTypes';
import TickerActionTypes from './TickerActionTypes';
import ProgressActions from './ProgressActions';
import ServerDAO from '../utils/ServerDAO';
import GameStates from './GameStates';


class ProgressStore extends ReduceStore {
    
    constructor() {
        super(PupilDispatcher);
    }

    getInitialState() {
        return {
            gameState: GameStates.WAITING_FOR_GAME
        }
    }

    handleTick(state, time) {
        switch (state.gameState) {
        case GameStates.WAITING_FOR_GAME:
            if (time % 3 == 0) {
                ServerDAO.getWaitingGame(1).
                    then((g) => {
                        if (g && g.found) {
                            ProgressActions.startGame(g);
                        }
                    });
            }
            return state;
        default:
            return state;
        }
    }

    reduce(state, action) {
        switch (action.type) {
        case TickerActionTypes.TICK:
            return this.handleTick(state, action.time);
            
        case ProgressActionTypes.START_GAME:
            return {gameState: GameStates.PLAYING_GAME};

        default:
            return state;
        }
    }

};

export default new ProgressStore();

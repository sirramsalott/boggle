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
            activeGame: undefined,
            gameState: GameStates.WAITING_FOR_GAME
        }
    }

    getWaitingGame(pupilID) {
        return ServerDAO.getWaitingGame(pupilID);
    }

    handleTick(state, time) {
        switch (state.gameState) {
        case GameStates.WAITING_FOR_GAME:
            if (time % 3 == 0) {
                const g = this.getWaitingGame(1);
                if (g) {
                    return {
                        activeGame: g,
                        gameState: GameStates.GAME_LOADED
                    };
                } else {
                    return state;
                }
            }
            
        default:
            return state;
        }
    }

    reduce(state, action) {
        switch (action.type) {
        case TickerActionTypes.TICK:
            return this.handleTick(state, action.time);
            
        case ProgressActionTypes.START_GAME:
            return state;

        default:
            return state;
        }
    }

};

export default new ProgressStore();

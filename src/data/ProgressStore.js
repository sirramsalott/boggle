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
            gameState: GameStates.WAITING_FOR_GAME,
            gameSecondsRemaining: 180
        }
    }

    handleTick(state, time) {
        switch (state.gameState) {
        case GameStates.WAITING_FOR_GAME:
            if (time % 3 == 0) {
                ServerDAO.getWaitingGame(sessionStorage.getItem('pupilID')).
                    then((g) => {
                        if (g && g.found) {
                            ProgressActions.startGame(g);
                        }
                    });
            }
            return state;

        case GameStates.PLAYING_GAME:
            if (state.gameSecondsRemaining == 1) {
                return {gameState: GameStates.SUBMITTING,
                        gameSecondsRemaining: 0};
            } else {
                return {gameState: state.gameState,
                        gameSecondsRemaining: state.gameSecondsRemaining - 1};
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
            return {gameState: GameStates.PLAYING_GAME,
                    gameSecondsRemaining: state.gameSecondsRemaining};

        default:
            return state;
        }
    }

};

export default new ProgressStore();

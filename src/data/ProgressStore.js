import {ReduceStore} from 'flux/utils';
import PupilDispatcher from './PupilDispatcher';
import ProgressActionTypes from './ProgressActionTypes';
import TickerActionTypes from './TickerActionTypes';
import ProgressActions from './ProgressActions';
import ServerDAO from '../utils/ServerDAO';
import GameStates from './GameStates';
import GameStore from './GameStore';


class ProgressStore extends ReduceStore {
    
    constructor() {
        super(PupilDispatcher);
    }

    getInitialState() {
        return {
            gameState: GameStates.MARKING_AS_WAITING,
            gameSecondsRemaining: 180,
            activeGameID: undefined,
        }
    }

    handleTick(state, time) {
        switch (state.gameState) {
        case GameStates.MARKING_AS_WAITING:
            if (time % 3 == 0) {
                ServerDAO.markAsWaiting(sessionStorage.getItem('pupilID')).
                    then((res) => {
                        if (res.done) {
                            ProgressActions.waitForGame();
                        }
                    });
            }
            return state;

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
                const words = GameStore.getState().submittedWords;
                const wordsJoined = words.
                      reduceRight((acc, val) => val + '#' + acc, '').
                      slice(0, -1);
                ServerDAO.submitGame(sessionStorage.getItem('pupilID'),
                                     state.activeGameID,
                                     wordsJoined).
                    then((a) => {
                        if (a && a.done) {
                            ProgressActions.scoreGame();
                        }
                    });
                return {gameState: GameStates.SUBMITTING,
                        gameSecondsRemaining: 0,
                        activeGameID: state.activeGameID};
            } else {
                return {gameState: state.gameState,
                        gameSecondsRemaining: state.gameSecondsRemaining - 1,
                        activeGameID: state.activeGameID};
            }
        default:
            return state;
        }
    }

    reduce(state, action) {
        switch (action.type) {
        case TickerActionTypes.TICK:
            return this.handleTick(state, action.time);

        case ProgressActionTypes.START_WAITING_FOR_GAME:
            return {gameState: GameStates.WAITING_FOR_GAME,
                    gameSecondsRemaining: state.gameSecondsRemaining,
                        activeGameID: state.activeGameID};
            
        case ProgressActionTypes.START_GAME:
            return {gameState: GameStates.PLAYING_GAME,
                    gameSecondsRemaining: state.gameSecondsRemaining,
                    activeGameID: action.data.gameID};

        default:
            return state;
        }
    }

};

export default new ProgressStore();

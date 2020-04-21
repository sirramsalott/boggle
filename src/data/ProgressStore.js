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
            ServerDAO.markAsWaiting(localStorage.getItem('pupilID')).
                then((res) => {
                    if (res && res.done) ProgressActions.waitForGame();
                });
            return state;

        case GameStates.WAITING_FOR_GAME:
            ServerDAO.getWaitingGame(localStorage.getItem('pupilID')).
                then((g) => {
                    if (g && g.found) ProgressActions.startGame(g);
                });
            return state;

        case GameStates.PLAYING_GAME:
        case GameStates.SUBMITTING:
            if (state.gameSecondsRemaining == 1 ||
                (state.gameSecondsRemaining < 1 && time % 3 == 0)) {
                const words = GameStore.getState().submittedWords;
                const wordsJoined = words.
                      reduceRight((acc, val) => val + '#' + acc, '').
                      slice(0, -1);
                ServerDAO.submitGame(localStorage.getItem('pupilID'),
                                     state.activeGameID,
                                     wordsJoined).
                    then((a) => {
                        if (a && a.done) ProgressActions.waitForSubmissions();
                    });
                return {gameState: GameStates.SUBMITTING,
                        gameSecondsRemaining: 0,
                        activeGameID: state.activeGameID};
            } else {
                return {gameState: state.gameState,
                        gameSecondsRemaining: state.gameSecondsRemaining - 1,
                        activeGameID: state.activeGameID};
            }

        case GameStates.WAITING_FOR_SUBMISSIONS:
            ServerDAO.haveAllPlayersSubmitted(state.activeGameID).
                then((a) => {
                    if (a && a.submitted) ProgressActions.scoreGame();
                });
            return state;

        case GameStates.SCORING:
            ServerDAO.scoreGame(localStorage.getItem('pupilID'),
                                state.activeGameID).
                then((a) => {
                    if (a && a.done) ProgressActions.waitForScores();
                });
            return state;

        case GameStates.WAITING_FOR_SCORES:
            ServerDAO.getScoreboard(state.activeGameID).
                then((a) => {
                    if (a && a.available) ProgressActions.gameComplete(a);
                });
            return state;

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

        case ProgressActionTypes.WAIT_FOR_SUBMISSIONS:
            return {gameState: GameStates.WAITING_FOR_SUBMISSIONS,
                    gameSecondsRemaining: state.gameSecondsRemaining,
                    activeGameID: state.activeGameID
                   };

        case ProgressActionTypes.SCORE_GAME:
            return {gameState: GameStates.SCORING,
                    gameSecondsRemaining: state.gameSecondsRemaining,
                    activeGameID: state.activeGameID};

        case ProgressActionTypes.WAIT_FOR_SCORES:
            return {gameState: GameStates.WAITING_FOR_SCORES,
                    gameSecondsRemaining: state.gameSecondsRemaining,
                    activeGameID: state.activeGameID
                   };

        case ProgressActionTypes.GAME_COMPLETE:
            return {gameState: GameStates.GAME_COMPLETE,
                    gameSecondsRemaining: state.gameSecondsRemaining,
                    activeGameID: state.activeGameID
                   };

        case ProgressActionTypes.PLAY_AGAIN:
            return this.getInitialState();

        case ProgressActionTypes.FINISH_EARLY:
            return {gameState: state.gameState,
                    gameSecondsRemaining: 1,
                    activeGameID: state.activeGameID
                   };

        default:
            return state;
        }
    }

};

export default new ProgressStore();

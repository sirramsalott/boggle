import ProgressActionTypes from './ProgressActionTypes';
import PupilDispatcher from './PupilDispatcher';

const Actions = {
    startGame(game) {
        PupilDispatcher.dispatch({
            type: ProgressActionTypes.START_GAME,
            data: game,
        });
    },
    waitForGame() {
        PupilDispatcher.dispatch({
            type: ProgressActionTypes.START_WAITING_FOR_GAME
        });
    },
    waitForSubmissions() {
        PupilDispatcher.dispatch({
            type: ProgressActionTypes.WAIT_FOR_SUBMISSIONS
        });
    },
    scoreGame() {
        PupilDispatcher.dispatch({
            type: ProgressActionTypes.SCORE_GAME
        });
    },
    waitForScores() {
        PupilDispatcher.dispatch({
            type: ProgressActionTypes.WAIT_FOR_SCORES
        });
    },
    gameComplete(gameID) {
        PupilDispatcher.dispatch({
            type: ProgressActionTypes.GAME_COMPLETE,
            gameID
        });
    },
};

export default Actions;

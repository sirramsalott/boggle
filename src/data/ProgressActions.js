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
    scoreGame() {
        PupilDispatcher.dispatch({
            type: ProgressActionTypes.SCORE_GAME
        });
    },
};

export default Actions;

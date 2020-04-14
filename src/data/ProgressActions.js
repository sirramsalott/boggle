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
    }
};

export default Actions;

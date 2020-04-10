import ProgressActionTypes from './ProgressActionTypes';
import PupilDispatcher from './PupilDispatcher';

const Actions = {
    startGame(game) {
        PupilDispatcher.dispatch({
            type: ProgressActionTypes.START_GAME,
            data: game,
        });
    },
};

export default Actions;

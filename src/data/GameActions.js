import GameActionTypes from './GameActionTypes';
import PupilDispatcher from './PupilDispatcher';

const Actions = {
    keyPress(k) {
        PupilDispatcher.dispatch({
            type: GameActionTypes.KEY_PRESS,
            key: k,
        });
    },
    wordSubmit() {
        PupilDispatcher.dispatch({
            type: GameActionTypes.WORD_SUBMIT,
        });
    },
    backSpace() {
        PupilDispatcher.dispatch({
            type: GameActionTypes.BACK_SPACE,
        });
    },
    wordCancel() {
        PupilDispatcher.dispatch({
            type: GameActionTypes.WORD_CANCEL,
        });
    },
    diceClick(diceIdx) {
        PupilDispatcher.dispatch({
            type: GameActionTypes.DICE_CLICK,
            diceIdx
        });
    },
};

export default Actions;

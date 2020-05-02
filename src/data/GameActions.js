import GameActionTypes from './GameActionTypes';
import PupilDispatcher from './PupilDispatcher';

const Actions = {
    wordSubmit() {
        PupilDispatcher.dispatch({
            type: GameActionTypes.WORD_SUBMIT,
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
    wordChange(word) {
        PupilDispatcher.dispatch({
            type: GameActionTypes.WORD_CHANGE,
            word
        });
    },
};

export default Actions;

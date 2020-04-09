import PupilActionTypes from './PupilActionTypes';
import PupilDispatcher from './PupilDispatcher';

const Actions = {
    click() {
	PupilDispatcher.dispatch({
	    type: PupilActionTypes.CLICK
	});
    },
    textChange(text) {
        PupilDispatcher.dispatch({
            type: PupilActionTypes.TEXT_CHANGE,
            text
        });
    },
    tick() {
        PupilDispatcher.dispatch({
            type: PupilActionTypes.TICK
        });
    },
};

export default Actions;

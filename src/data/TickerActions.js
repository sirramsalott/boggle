import TickerActionTypes from './TickerActionTypes';
import PupilDispatcher from './PupilDispatcher';

const Actions = {
    tick(time) {
        PupilDispatcher.dispatch({
            type: TickerActionTypes.TICK,
            time,
        });
    },
};

export default Actions;

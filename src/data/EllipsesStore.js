import {ReduceStore} from 'flux/utils';
import PupilDispatcher from './PupilDispatcher';
import TickerActionTypes from './TickerActionTypes';

class EllipsesStore extends ReduceStore {
    constructor() {
        super(PupilDispatcher);
    }

    getInitialState() {
        return 0;
    }

    reduce(state, action) {
        switch (action.type) {
        case TickerActionTypes.TICK:
            return (state + 1) % 4;
        default:
            return state;
        }
    }
}

export default new EllipsesStore();

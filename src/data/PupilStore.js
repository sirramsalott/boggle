import Immutable from 'immutable';
import {ReduceStore} from 'flux/utils';
import PupilActionTypes from './PupilActionTypes';
import PupilDispatcher from './PupilDispatcher';

class PupilStore extends ReduceStore {
    constructor() {
	super(PupilDispatcher);
    }

    getInitialState() {
	return {
            listItems: Immutable.List(),
            textBox: '',
            time: 0,
        };
    }

    reduce(state, action) {
	switch (action.type) {
	case PupilActionTypes.CLICK:
	    return {
                listItems: state.listItems.push({val: state.textBox,
                                                 key: state.listItems.size}),
                textBox: '',
                time: state.time,
            };

        case PupilActionTypes.TEXT_CHANGE:
            return {
                listItems: state.listItems,
                textBox: action.text,
                time: state.time,
            };

        case PupilActionTypes.TICK:
            return {
                listItems: state.listItems,
                textBox: action.text,
                time: state.time + 1,
            };

	default:
	    return state;
	}
    }

}

export default new PupilStore();

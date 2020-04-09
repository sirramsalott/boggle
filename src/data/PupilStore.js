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
            textBox: ''
        };
    }

    reduce(state, action) {
	switch (action.type) {
	case PupilActionTypes.CLICK:
	    return {
                listItems: state.listItems.push({val: state.textBox,
                                                 key: state.listItems.size}),
                textBox: ''
            };

        case PupilActionTypes.TEXT_CHANGE:
            return {
                listItems: state.listItems,
                textBox: action.text
            };

	default:
	    return state;
	}
    }

}

export default new PupilStore();

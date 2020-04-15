import {ReduceStore} from 'flux/utils';
import PupilDispatcher from './PupilDispatcher';
import Immutable from 'immutable';

class GameStore extends ReduceStore {
    constructor() {
        super(PupilDispatcher);
    }

    getInitialState() {
        return {
            submittedWords: Immutable.List(),
        };
    }

    reduce(state, action) {
        return state;
    }

};

export default new GameStore();


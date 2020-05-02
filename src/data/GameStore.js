import {ReduceStore} from 'flux/utils';
import PupilDispatcher from './PupilDispatcher';
import Immutable from 'immutable';
import ProgressActionTypes from './ProgressActionTypes';
import GameActionTypes from './GameActionTypes';
import splitBoard from '../utils/splitBoard';

class GameStore extends ReduceStore {
    constructor() {
        super(PupilDispatcher);
    }

    getInitialState() {
        return {
            submittedWords: Immutable.List(),
            activeBoard: undefined,
            activeWord: '',
            activeDice: Immutable.List(),
            scoreboard: undefined,
        };
    }

    reduce(state, action) {
        switch (action.type) {
        case ProgressActionTypes.START_GAME:
            return {submittedWords: state.submittedWords,
                    activeBoard: splitBoard(action.data.board),
                    activeWord: state.activeWord,
                    activeDice: state.activeDice,
                    scoreboard: state.scoreboard};

        case ProgressActionTypes.PLAY_AGAIN:
            return this.getInitialState();

        case ProgressActionTypes.GAME_COMPLETE:
            return {submittedWords: state.submittedWords,
                    activeBoard: state.activeBoard,
                    activeWord: state.activeWord,
                    activeDice: state.activeDice,
                    scoreboard: action.scoreboard};

        case GameActionTypes.WORD_SUBMIT:
            if (state.activeWord.length > 0)
                return {submittedWords: state.submittedWords.push(state.activeWord),
                        activeBoard: state.activeBoard,
                        activeWord: '',
                        activeDice: Immutable.List(),
                        scoreboard: state.scoreboard};

        case GameActionTypes.WORD_CANCEL:
            return {submittedWords: state.submittedWords,
                    activeBoard: state.activeBoard,
                    activeWord: '',
                    activeDice: Immutable.List(),
                    scoreboard: state.scoreboard};

        case GameActionTypes.DICE_CLICK:
            if (!state.activeDice.includes(action.diceIdx))
                return {submittedWords: state.submittedWords,
                        activeBoard: state.activeBoard,
                        activeWord: state.activeWord +
                                    state.activeBoard.get(action.diceIdx),
                        activeDice: state.activeDice.push(action.diceIdx),
                        scoreboard: state.scoreboard};

            else if (state.activeDice.get(-1) == action.diceIdx) {
                const activeWord = state.activeBoard.get(state.activeDice.get(-1)) == 'qu' ?
                      state.activeWord.slice(0, -2) : state.activeWord.slice(0, -1);
                return {submittedWords: state.submittedWords,
                        activeBoard: state.activeBoard,
                        activeWord,
                        activeDice: state.activeDice.slice(0, -1),
                        scoreboard: state.scoreboard};
            } else
                return state;

        case GameActionTypes.WORD_CHANGE:
            return {submittedWords: state.submittedWords,
                    activeBoard: state.activeBoard,
                    activeWord: action.word,
                    activeDice: state.activeDice,
                    scoreboard: state.scoreboard};

        default:
            return state;
        }
    }

};

export default new GameStore();


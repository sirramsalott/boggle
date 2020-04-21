import Immutable from 'immutable';
import ProgressActionTypes from '../ProgressActionTypes';
import GameActionTypes from '../GameActionTypes';

jest.mock('../PupilDispatcher');
jest.dontMock('../GameStore');

describe('GameStore', () => {

    var GameStore;
    var Dispatcher;
    var dispatch;

    beforeEach(() => {
        GameStore = require('../GameStore').default;
        var Dispatcher = require('../PupilDispatcher').default;
        dispatch = Dispatcher.register.mock.calls[0][0];
        Dispatcher.isDispatching = jest.fn(() => true);
    });

    it('has correct initial state', () => {
        expect(GameStore.getState()).
            toMatchObject({
                submittedWords: Immutable.List(),
                activeBoard: undefined
            });
    });

    it('splits board correctly', () => {
        const splitted = GameStore.splitBoard('abcdquieeplsdfguh');
        expect(splitted.size).toEqual(16);
        expect(splitted).toEqual(Immutable.List([
            'a',  'b', 'c', 'd',
            'qu', 'i', 'e', 'e',
            'p',  'l', 's', 'd',
            'f',  'g', 'u', 'h']));
    });

    it('updates state on receiving new game', () => {
        dispatch({type: ProgressActionTypes.START_GAME,
                  data: {'found': true,
                         'gameID': 1,
                         'board': 'abcdquieeplsdfguh'}});
        expect(GameStore.getState().activeBoard).
            toEqual(Immutable.List([
                'a',  'b', 'c', 'd',
                'qu', 'i', 'e', 'e',
                'p',  'l', 's', 'd',
                'f',  'g', 'u', 'h']));
    });

    it('updates active word on keypress', () => {
        dispatch({type: GameActionTypes.KEY_PRESS,
                  key: 'p'});
        expect(GameStore.getState().activeWord).
            toEqual('p');
        dispatch({type: GameActionTypes.KEY_PRESS,
                  key: 'o'});
        expect(GameStore.getState().activeWord).
            toEqual('po');
    });

    it('saves word to list and clear active word on enter', () => {
        dispatch({type: GameActionTypes.WORD_SUBMIT});
        expect(GameStore.getState().submittedWords).
            toEqual(Immutable.List(['po']));
        expect(GameStore.getState().activeWord).
            toEqual('');
    });

    it('does not push empty word', () => {
        dispatch({type: GameActionTypes.WORD_SUBMIT});
        expect(GameStore.getState().submittedWords.size).
            toBe(1);
    });

    it('deletes last letter on backspace', () => {
        dispatch({type: GameActionTypes.KEY_PRESS,
                  key: 'p'});
        dispatch({type: GameActionTypes.KEY_PRESS,
                  key: 'o'});
        dispatch({type: GameActionTypes.BACK_SPACE});
        expect(GameStore.getState().activeWord).
            toEqual('p');
    });

    it('cancels word when prompted', () => {
        dispatch({type: GameActionTypes.KEY_PRESS,
                  key: 'p'});
        dispatch({type: GameActionTypes.KEY_PRESS,
                  key: 'o'});
        dispatch({type: GameActionTypes.WORD_CANCEL});
        expect(GameStore.getState().activeWord).
            toEqual('');
        expect(GameStore.getState().activeDice.size).toBe(0);
    });

    it('adds letter on dice click', () => {
        dispatch({type: GameActionTypes.DICE_CLICK,
                  diceIdx: 4});
        expect(GameStore.getState().activeWord).
            toEqual('qu');
        expect(GameStore.getState().activeDice).
            toEqual(Immutable.List([4]));
    });

    it('does not add letter again', () => {
        dispatch({type: GameActionTypes.DICE_CLICK,
                  diceIdx: 1});
        dispatch({type: GameActionTypes.DICE_CLICK,
                  diceIdx: 4});
        expect(GameStore.getState().activeWord).
            toEqual('qub');
    });

    it('removes last letter on click', () => {
        dispatch({type: GameActionTypes.WORD_CANCEL});
        dispatch({type: GameActionTypes.DICE_CLICK,
                  diceIdx: 5});
        dispatch({type: GameActionTypes.DICE_CLICK,
                  diceIdx: 4});
        dispatch({type: GameActionTypes.DICE_CLICK,
                  diceIdx: 1});
        dispatch({type: GameActionTypes.DICE_CLICK,
                  diceIdx: 1});
        expect(GameStore.getState().activeWord).
            toEqual('iqu');
        dispatch({type: GameActionTypes.DICE_CLICK,
                  diceIdx: 4});
        expect(GameStore.getState().activeWord).
            toEqual('i');
    });

    it('resets on play again action', () => {
        dispatch({type: ProgressActionTypes.PLAY_AGAIN});
        expect(GameStore.getState()).
            toMatchObject(GameStore.getInitialState());
    });

    it('updates game on receiving', () => {
        const scoreboard = {available: true,
                            board: 'abcdefg',
                            players: [1, 2, 3]};
        dispatch({type: ProgressActionTypes.GAME_COMPLETE,
                  scoreboard});
        expect(GameStore.getState().scoreboard).
            toMatchObject(scoreboard);
    });

});

import GameStates from '../GameStates';
import TickerActionTypes from '../TickerActionTypes';
import ProgressActionTypes from '../ProgressActionTypes';
import Immutable from 'immutable';


jest.mock('../PupilDispatcher');
jest.mock('../../utils/ServerDAO');
jest.mock('../GameStore');
jest.dontMock('../ProgressStore');


describe('ProgressStore', function() {

    var Dispatcher;
    var ProgressStore;
    var dispatch;
    var ServerDAO;
    var TickerActions;
    var GameStore;

    beforeEach(function() {
        Dispatcher = require('../PupilDispatcher').default;
        ProgressStore = require('../ProgressStore').default;
        dispatch = Dispatcher.register.mock.calls[0][0];
        ServerDAO = require('../../utils/ServerDAO').default;
        GameStore = require('../../data/GameStore').default;

        ServerDAO.markAsWaiting =
            jest.fn(_ => ({then: f => f({'done': false})}));
    });

    afterEach(() => {
        Dispatcher.dispatch.mockClear();
    });

    it('initialises with correct state', function() {
        expect(ProgressStore.getState()).
            toMatchObject({gameState: GameStates.MARKING_AS_WAITING,
                           gameSecondsRemaining: 180});
    });

    it('does not check for waiting game before told to', function() {
        dispatch({type: TickerActionTypes.TICK,
                  time: 0});
        expect(ServerDAO.getWaitingGame.mock.calls.length).toBe(0);
    });

    it('marks as waiting on first tick and dispatches on success', function() {
        Dispatcher.isDispatching = jest.fn(() => true);
        ServerDAO.markAsWaiting =
            jest.fn(_ => ({then: f => f({'done': true})}));
        dispatch({type: TickerActionTypes.TICK,
                  time: 0});
        expect(ServerDAO.markAsWaiting.mock.calls.length).toBe(1);
        expect(Dispatcher.dispatch.mock.calls.length).toBe(1);
        expect(Dispatcher.dispatch.mock.calls[0][0]).
            toMatchObject({type: ProgressActionTypes.START_WAITING_FOR_GAME});
    });

    it('changes state on marking success', function() {
        dispatch({type: ProgressActionTypes.START_WAITING_FOR_GAME});
        expect(ProgressStore.getState()).
            toMatchObject({gameState: GameStates.WAITING_FOR_GAME});
    });

    it('no game dispatched on receiving empty game', function() {
        const fakeGame = {found: false};
        ServerDAO.getWaitingGame =
            jest.fn(_ => ({then: f => f(fakeGame)}));
        dispatch({type: TickerActionTypes.TICK,
                  time: 0});
        expect(Dispatcher.dispatch.mock.calls.length).toBe(0);
    });

    it('dispatches new game on receiving', function() {
        const fakeGame = {board: 'abc',
                          found: true,
                          gameID: 1};
        ServerDAO.getWaitingGame =
            jest.fn(_ => ({then: f => f(fakeGame)}));
        dispatch({type: TickerActionTypes.TICK,
                  time: 0});
        expect(Dispatcher.dispatch.mock.calls.length).toBe(1);
        expect(Dispatcher.dispatch.mock.calls[0][0]).
            toMatchObject({type: ProgressActionTypes.START_GAME,
                           data: fakeGame});
    });

    it('moves to new state on receiving startGame action', function() {
        dispatch({type: ProgressActionTypes.START_GAME,
                  data: {board: 'abc',
                         found: true,
                         gameID: 5}});
        expect(ProgressStore.getState()).
            toMatchObject({gameState: GameStates.PLAYING_GAME,
                           activeGameID: 5});
    });

    it('seconds remaining decrease on tick', function() {
        dispatch({type: ProgressActionTypes.START_GAME,
                  data: {game: 'doesnt matter'}});
        ProgressStore.gameState = GameStates.PLAYING_GAME;
        dispatch({type: TickerActionTypes.TICK,
                  time: 0});
        expect(ProgressStore.getState()).
            toMatchObject({gameState: GameStates.PLAYING_GAME,
                           gameSecondsRemaining: 179});
    });

    it('changes state and submits on game completion', function() {
        const wordList = Immutable.List(['big', 'ram']);
        GameStore.getState = jest.fn(() => ({submittedWords: wordList}));
        ServerDAO.submitGame = jest.fn((p, g, w) => ({then: f => f({done: true})}));

        expect(ProgressStore.getState()).
            toMatchObject({gameState: GameStates.PLAYING_GAME,
                           gameSecondsRemaining: 179});
        for (var i = 0; i < 178; i++) {
            dispatch({type: TickerActionTypes.TICK,
                      time: i + 1});
        }
        expect(Dispatcher.dispatch.mock.calls.length).toBe(0);
        expect(ProgressStore.getState()).
            toMatchObject({gameState: GameStates.PLAYING_GAME,
                           gameSecondsRemaining: 1});

        dispatch({type: TickerActionTypes.TICK,
                  time: i + 1});
        expect(ProgressStore.getState()).
            toMatchObject({gameState: GameStates.SUBMITTING});
        expect(ServerDAO.submitGame.mock.calls.length).
            toBe(1);
        expect(ServerDAO.submitGame.mock.calls[0][1]).
            toEqual("big#ram");
        expect(Dispatcher.dispatch.mock.calls.length).
            toBe(1);
        expect(Dispatcher.dispatch.mock.calls[0][0]).
            toMatchObject({type: ProgressActionTypes.SCORE_GAME});
    });

});

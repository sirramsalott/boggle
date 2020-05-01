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
        ProgressStore.validateLocalStorage =
            jest.fn(() => true);
        ServerDAO.markAsWaiting =
            jest.fn(_ => ({then: f => f({'done': false})}));
        ServerDAO.stillHere = jest.fn();
    });

    afterEach(() => {
        Dispatcher.dispatch.mockClear();
    });

    it('initialises with correct state', function() {
        expect(ProgressStore.getState()).
            toMatchObject({gameState: GameStates.MARKING_AS_WAITING,
                           gameSecondsRemaining: 180});
    });

    it('pings stillHere on tick', function() {
        dispatch({type: TickerActionTypes.TICK,
                  time: 12});
        expect(ServerDAO.stillHere.mock.calls.length).toBe(1)
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
                          gameID: 11};
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
        expect(ProgressStore.getState()).
            toMatchObject({gameState: GameStates.PLAYING_GAME,
                           gameSecondsRemaining: 180});
        dispatch({type: TickerActionTypes.TICK,
                  time: 0});
        expect(ProgressStore.getState()).
            toMatchObject({gameState: GameStates.PLAYING_GAME,
                           gameSecondsRemaining: 179});
    });

    it('changes state and submits on game completion, ' +
       'does not change on failed submission', function() {
        const wordList = Immutable.List(['big', 'ram']);
        GameStore.getState = jest.fn(() => ({submittedWords: wordList}));
        ServerDAO.submitGame = jest.fn((p, g, w) => ({then: f => f({done: false})}));

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
            toBe(5);
        expect(ServerDAO.submitGame.mock.calls[0][2]).
            toEqual("big#ram");
         expect(Dispatcher.dispatch.mock.calls.length).
            toBe(0);
    });

    it('dispatches on successful submission', function() {
        ServerDAO.submitGame = jest.fn((p, g, w) => ({then: f => f({done: true})}));
        dispatch({type: TickerActionTypes.TICK,
                  time: 3});
        expect(Dispatcher.dispatch.mock.calls.length).
            toBe(1);
        expect(Dispatcher.dispatch.mock.calls[0][0]).
            toMatchObject({type: ProgressActionTypes.WAIT_FOR_SUBMISSIONS});
    });

    it('waits for submissions on receiving action', function() {
        dispatch({type: ProgressActionTypes.WAIT_FOR_SUBMISSIONS});
        expect(ProgressStore.getState()).
            toMatchObject({gameState: GameStates.WAITING_FOR_SUBMISSIONS});
    });

    it('ask if all players have submitted on tick', function() {
        ServerDAO.haveAllPlayersSubmitted = jest.fn((g) => ({then: f => f({submitted: false})}));
        dispatch({type: TickerActionTypes.TICK,
                  time: 3});
        expect(ServerDAO.haveAllPlayersSubmitted.mock.calls.length).
            toBe(1);
        expect(ServerDAO.haveAllPlayersSubmitted.mock.calls[0][0]).
            toBe(5);
        expect(Dispatcher.dispatch.mock.calls.length).
            toBe(0);
    });

    it('dispatches when all players have submitted', function() {
        ServerDAO.haveAllPlayersSubmitted = jest.fn((g) => ({then: f => f({submitted: true})}));
        dispatch({type: TickerActionTypes.TICK,
                  time: 3});
        expect(Dispatcher.dispatch.mock.calls.length).
            toBe(1);
        expect(Dispatcher.dispatch.mock.calls[0][0]).
            toMatchObject({type: ProgressActionTypes.SCORE_GAME});
    });

    it('changes state on receiving score action', function() {
        dispatch({type: ProgressActionTypes.SCORE_GAME});
        expect(ProgressStore.getState()).
            toMatchObject({gameState: GameStates.SCORING});
    });

    it('score my game on tick, dispatch on success', function() {
        ServerDAO.scoreGame = jest.fn((p, g) => ({then: f => f({done: true})}));
        dispatch({type: TickerActionTypes.TICK,
                  time: 3});
        expect(ServerDAO.scoreGame.mock.calls.length).
            toBe(1);
        expect(ServerDAO.scoreGame.mock.calls[0][1]).
            toBe(5);
        expect(Dispatcher.dispatch.mock.calls.length).
            toBe(1);
        expect(Dispatcher.dispatch.mock.calls[0][0]).
            toMatchObject({type: ProgressActionTypes.WAIT_FOR_SCORES});
    });

    it('change state on receiving wait for scores action', function() {
        dispatch({type: ProgressActionTypes.WAIT_FOR_SCORES});
        expect(ProgressStore.getState()).
            toMatchObject({gameState: GameStates.WAITING_FOR_SCORES});
    });

    it('check for scores on tick, do nothing if not all scored', function() {
        ServerDAO.getScoreboard = jest.fn((g) => ({then: f => f({available: false})}));
        dispatch({type: TickerActionTypes.TICK,
                  time: 7});
        expect(ServerDAO.getScoreboard.mock.calls.length).
            toBe(1);
        expect(ServerDAO.getScoreboard.mock.calls[0][0]).
            toBe(5);
        expect(Dispatcher.dispatch.mock.calls.length).
            toBe(0);
    });

    it('dispatches GameComplete when all players have scored', function() {
        ServerDAO.getScoreboard = jest.fn((g) => ({then: f => f({available: true,
                                                                 players: [1, 2, 3]})}));
        dispatch({type: TickerActionTypes.TICK,
                  time: 8});
        expect(Dispatcher.dispatch.mock.calls.length).
            toBe(1);
        expect(Dispatcher.dispatch.mock.calls[0][0]).
            toMatchObject({type: ProgressActionTypes.GAME_COMPLETE,
                           scoreboard: {available: true,
                                        players: [1, 2, 3]}});
    });

    it('changes state on receiving game complete', function() {
        dispatch({type: ProgressActionTypes.GAME_COMPLETE});
        expect(ProgressStore.getState()).
            toMatchObject({gameState: GameStates.GAME_COMPLETE});
    });

    it('goes back to initial state on receiving PlayAgain', function() {
        dispatch({type: ProgressActionTypes.PLAY_AGAIN});
        expect(ProgressStore.getState()).
            toMatchObject(ProgressStore.getInitialState());
    });

});

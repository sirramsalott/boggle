import GameStates from '../GameStates';
import TickerActionTypes from '../TickerActionTypes';
import ProgressActionTypes from '../ProgressActionTypes';


jest.mock('../PupilDispatcher');
jest.mock('../../utils/ServerDAO');
jest.dontMock('../ProgressStore');


describe('ProgressStore', function() {

    var Dispatcher;
    var ProgressStore;
    var dispatch;
    var ServerDAO;
    var TickerActions;

    beforeEach(function() {
        Dispatcher = require('../PupilDispatcher').default;
        ProgressStore = require('../ProgressStore').default;
        dispatch = Dispatcher.register.mock.calls[0][0];
        ServerDAO = require('../../utils/ServerDAO').default;

        ServerDAO.getWaitingGame = jest.fn(
            x => ({then: f => f({game: undefined,
                                 found: false})}));
    });

    afterEach(() => {
        Dispatcher.dispatch.mockClear();
    });

    it('initialises with correct state', function() {
        expect(ProgressStore.getState()).
            toMatchObject({gameState: GameStates.WAITING_FOR_GAME});
    });

    it('registers a callback with dispatcher', function() {
        expect(Dispatcher.register.mock.calls.length).toBe(1);
    });

    it('checks for waiting game on first tick', function() {
        dispatch({type: TickerActionTypes.TICK,
                  time: 0});
        expect(ServerDAO.getWaitingGame.mock.calls.length).toBe(1);
    });

    it('no game dispatched on receiving empty game', function() {
        Dispatcher.isDispatching = jest.fn(() => true);
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
                  data: {game: 'doesnt matter'}});
        expect(ProgressStore.getState()).
            toMatchObject({gameState: GameStates.PLAYING_GAME});
    });

});

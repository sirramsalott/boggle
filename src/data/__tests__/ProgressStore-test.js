import GameStates from '../GameStates';
import TickerActionTypes from '../TickerActionTypes';


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
        
    });


    it('initialises with correct state', function() {
        expect(ProgressStore.getState()).
            toEqual(expect.
                    objectContaining({
                        gameState: GameStates.WAITING_FOR_GAME,
                        activeGame: undefined
                    })
                   );
    });


    it('registers a callback with dispatcher', function() {
        expect(Dispatcher.register.mock.calls.length).toBe(1);
    });


    it('checks for waiting game on first tick', function() {
        dispatch({type: TickerActionTypes.TICK,
                  time: 0});
        expect(ServerDAO.getWaitingGame.mock.calls.length).toBe(1);
    });


    it('changes state on receiving a new game', function() {
        const fakeGame = {"game": {"id": 1, "board": "abc"}}
        ServerDAO.getWaitingGame = jest.fn(x => fakeGame);
        Dispatcher.isDispatching = jest.fn(() => true);
        dispatch({type: TickerActionTypes.TICK,
                  time: 0});
        expect(ProgressStore.getState()).
            toEqual({gameState: GameStates.GAME_LOADED,
                     activeGame: fakeGame});
    });

});

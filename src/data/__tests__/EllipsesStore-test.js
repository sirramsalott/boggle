import TickerActionTypes from '../TickerActionTypes';

jest.mock('../PupilDispatcher');
jest.dontMock('../EllipsesStore');

describe('EllipsesStore', () => {

    var Store;
    var dispatch;

    beforeEach(() => {
        Store = require('../EllipsesStore').default;
        var Dispatcher = require('../PupilDispatcher').default;
        dispatch = Dispatcher.register.mock.calls[0][0];
        Dispatcher.isDispatching = jest.fn(() => true);
    });

    it('updates on tick', () => {
        expect(Store.getState()).toBe(0);
        dispatch({type: TickerActionTypes.TICK});
        expect(Store.getState()).toBe(1);
        dispatch({type: TickerActionTypes.TICK});
        expect(Store.getState()).toBe(2);
        dispatch({type: TickerActionTypes.TICK});
        expect(Store.getState()).toBe(3);
        dispatch({type: TickerActionTypes.TICK});
        expect(Store.getState()).toBe(0);
    });
});

import React from 'react';
import Enzyme, { shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import WaitingPane from '../WaitingPane';
import GameStates from '../../data/GameStates';

Enzyme.configure({ adapter: new Adapter() });

describe('WaitingPane', () => {

    it('does not render when playing game', () => {
        const wrapper = shallow(<WaitingPane
                                  gameState={GameStates.PLAYING_GAME}
                                />);
        expect(wrapper.find(WaitingPane)).toEqual({});
    });

    it('shows correct prompt when waiting for game', () => {
        const wrapper = shallow(<WaitingPane
                                  gameState={GameStates.WAITING_FOR_GAME}
                                />);
        expect(wrapper.find('.waitingPrompt').prop('children')).
            toEqual('Please wait while you are connected to a game');
    });

});

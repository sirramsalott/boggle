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
        expect(wrapper.find('.prompt').prop('children')).
            toEqual('Please wait while you are connected to a game');
    });

    it('shows correct prompt when submitting', () => {
        const wrapper = shallow(<WaitingPane
                                  gameState={GameStates.SUBMITTING}
                                />);
        expect(wrapper.find('.prompt').prop('children')).
            toEqual('Submitting your game');
    });

    it('shows correct prompt when marking as waiting', () => {
        const wrapper = shallow(<WaitingPane
                                  gameState={GameStates.MARKING_AS_WAITING}
                                />);
        expect(wrapper.find('.prompt').prop('children')).
            toEqual('Marking as waiting');
    });

    it('shows correct prompt when waiting for submissions', () => {
        const wrapper = shallow(<WaitingPane
                                  gameState={GameStates.WAITING_FOR_SUBMISSIONS}
                                />);
        expect(wrapper.find('.prompt').prop('children')).
            toEqual('Waiting for other players to submit');
    });

    it('shows correct prompt when scoring', () => {
        const wrapper = shallow(<WaitingPane
                                  gameState={GameStates.SCORING}
                                />);
        expect(wrapper.find('.prompt').prop('children')).
            toEqual('Scoring your game');
    });

    it('shows correct prompt when waiting for scores', () => {
        const wrapper = shallow(<WaitingPane
                                  gameState={GameStates.WAITING_FOR_SCORES}
                                />);
        expect(wrapper.find('.prompt').prop('children')).
            toEqual('Waiting for the scores');
    });

});

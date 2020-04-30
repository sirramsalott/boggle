import React from 'react';
import Enzyme, { shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import GameView from '../GameView';
import GameStates from '../../data/GameStates';

Enzyme.configure({ adapter: new Adapter() });

describe('GameView', () => {

    it('handles word submit', () => {
        var onEnter = jest.fn();
        const wrapper = shallow(<GameView
                                  onWordSubmit={onEnter}
                                  gameState={GameStates.PLAYING_GAME}
                                  wordList={Array()}
                                />);
        wrapper.find('#enterWord').simulate('keydown', {key: 'Enter'});
        expect(onEnter.mock.calls.length).toBe(1);
    });

    it('clicking yes button submits word', () => {
        var onClick = jest.fn();
        const wrapper = shallow(<GameView
                                  onWordSubmit={onClick}
                                  gameState={GameStates.PLAYING_GAME}
                                  wordList={Array()}
                                />);
        wrapper.find('#yesButton').simulate('click');
        expect(onClick.mock.calls.length).toBe(1);
    });

    it('clicking no button cancels word', () => {
        var onClick = jest.fn();
        const wrapper = shallow(<GameView
                                  onWordCancel={onClick}
                                  gameState={GameStates.PLAYING_GAME}
                                  wordList={Array()}
                                />);
        wrapper.find('#noButton').simulate('click');
        expect(onClick.mock.calls.length).toBe(1);
    });

    it('finishes early', () => {
        var onClick = jest.fn();
        const wrapper = shallow(<GameView
                                  finishEarly={onClick}
                                  gameState={GameStates.PLAYING_GAME}
                                  wordList={Array()}
                                />);
        wrapper.find('#finishEarly').simulate('click');
        expect(onClick.mock.calls.length).toBe(1);
    });

});

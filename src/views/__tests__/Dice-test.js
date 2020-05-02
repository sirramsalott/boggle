import React from 'react';
import Enzyme, { shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import Dice from '../Dice';

Enzyme.configure({ adapter: new Adapter() });

describe('Dice', () => {
    it('calls click handler on click', () => {
        var onClick = jest.fn();
        const wrapper = shallow(<Dice
                                  onDiceClick={onClick}
                                  diceIdx={5}
                                  activeBoard={{get: jest.fn()}}
                                  activeDice={{includes: jest.fn()}}
                                />);
        wrapper.find('img').simulate('click');
        expect(onClick.mock.calls.length).toBe(1);
        expect(onClick.mock.calls[0][0]).toBe(5);
    });
});
    

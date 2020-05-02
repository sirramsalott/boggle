import React from 'react';
import Enzyme, { shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import WordList from '../WordList';

Enzyme.configure({ adapter: new Adapter() });

describe('WordList', () => {

    it('renders words', () => {
        const wrapper = shallow(<WordList
              scoreboard={{"possibleWords": ["cake", "each", "mine",
                                             "dogs", "cakes", "dog"]}}
                                />);
        for (var i = 0; i < 6; i++)
            expect(wrapper.findWhere(n => n.key() == 'word' + i)).
                   toBeTruthy();
    });

});

import React from 'react';

function Dice(props) {
    return (<img
              src={'/images/' +
                   props.activeBoard.get(props.diceIdx) + '.png'}
              onClick={() => props.onDiceClick(props.diceIdx)}
              style={{filter: props.activeDice.includes(props.diceIdx) ?
                              'sepia(100%) saturate(300%) ' +
                              'brightness(70%) hue-rotate(180deg)' :
                              'none'}}
              className={props.mini ? 'miniDice' : 'dice'}
            />);
}

export default Dice;

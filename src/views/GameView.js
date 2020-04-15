import React from 'react';
import GameStates from '../data/GameStates';

function GameView(props) {
    if (props.gameState == GameStates.PLAYING_GAME) {
        return (<div>
                GAME
                </div>
               );
    } else {
        return null;
    }
};

export default GameView;

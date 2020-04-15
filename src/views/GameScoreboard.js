import React from 'react';
import GameStates from '../data/GameStates';

function GameScoreboard(props) {
    if (props.gameState == GameStates.GAME_COMPLETE) {
        return (<div>
                GAME
                </div>
               );
    } else {
        return null;
    }
};

export default GameScoreboard;

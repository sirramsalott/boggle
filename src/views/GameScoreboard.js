import React from 'react';
import GameStates from '../data/GameStates';

function GameScoreboard(props) {
    if (props.gameState == GameStates.GAME_COMPLETE) {
        return (<div>
                  <p>{props.scoreboard.board}</p>
                  <input type='button' onClick={props.playAgain} value='Play again'/>
                </div>
               );
    } else {
        return null;
    }
};

export default GameScoreboard;

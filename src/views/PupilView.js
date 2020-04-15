import React from 'react';
import Ticker from '../utils/Ticker';
import WaitingPane from './WaitingPane';
import GameView from './GameView';
import GameStates from '../data/GameStates';

function PupilView(props) {
    var gameView = (props.gameState == GameStates.PLAYING_GAME) ?
        <GameView {...props} /> : null;
    return(
        <div>
          <Ticker {...props} />
          <WaitingPane {...props} />
          {gameView}
        </div>
    );
}

export default PupilView;


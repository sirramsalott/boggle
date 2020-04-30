import React from 'react';
import Ticker from '../utils/Ticker';
import WaitingPane from './WaitingPane';
import GameView from './GameView';
import GameScoreboard from './GameScoreboard';

function PupilView(props) {
    return(
        <div id='pageContainer'>
          <Ticker {...props} />
          <WaitingPane {...props} />
          <GameView {...props} />
          <GameScoreboard {...props} />
        </div>
    );
}

export default PupilView;


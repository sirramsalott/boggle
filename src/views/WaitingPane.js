import React from 'react';
import GameStates from '../data/GameStates';

function prompt(state) {
    switch (state) {
    case GameStates.WAITING_FOR_GAME:
        return 'Please wait while you are connected to a game';

    case GameStates.SUBMITTING:
        return 'Submitting your game';

    case GameStates.MARKING_AS_WAITING:
        return 'Marking as waiting';

    case GameStates.WAITING_FOR_SUBMISSIONS:
        return 'Waiting for other players to submit';

    case GameStates.SCORING:
        return 'Scoring your game';

    case GameStates.WAITING_FOR_SCORES:
        return 'Waiting for the scores';

    default:
        return 'Not yet implemented';
    }
}

function WaitingPane(props) {
    switch (props.gameState) {
    case GameStates.PLAYING_GAME:
    case GameStates.GAME_COMPLETE:
    case GameStates.ERROR:
        return null;

    default:
        return (<React.Fragment>
                  <img id="boggleLogo" src="/images/boggleLogo.png"/>
                  <div className='centreForeground'
                       id="waitingPane">
                    <h2 className="prompt">
                      {prompt(props.gameState)}
                    </h2>
                    <h1 id='ellipses'>
                      {'.'.repeat(props.numEllipses)}
                    </h1>
                  </div>
                </React.Fragment>);
    }
}

export default WaitingPane;

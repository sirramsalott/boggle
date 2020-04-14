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

    default:
        return 'Not yet implemented';
    }
}

function WaitingPane(props) {
    switch (props.gameState) {
    case GameStates.PLAYING_GAME:
        return null;

    default:
        return (<div id="waitingPane">
                  <h2 className="waitingPrompt">
                    {prompt(props.gameState)}
                  </h2>
                </div>);
    }
}

export default WaitingPane;

import React from 'react';
import GameStates from '../data/GameStates';

function ErrorPane(props) {
    switch (props.gameState) {
    case GameStates.ERROR:
        return (<React.Fragment>
                  <img id="boggleLogo" src="/images/boggleLogo.png"/>
                  <div className='centreForeground'>
                    <h3>An error occurred</h3>
                    <p id='errorMessage'>{props.errorMsg}</p>
                  </div>
                 </React.Fragment>);

    default:
        return null;
    }
}

export default ErrorPane;

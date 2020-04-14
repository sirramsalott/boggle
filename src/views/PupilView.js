import React from 'react';
import Ticker from '../utils/Ticker';
import WaitingPane from './WaitingPane';

function PupilView(props) {
    return(
        <div>
          <Ticker {...props} />
          <WaitingPane {...props} />
        </div>
    );
}

export default PupilView;


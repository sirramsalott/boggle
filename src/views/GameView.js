import React from 'react';
import GameStates from '../data/GameStates';
import Dice from './Dice';

function Board(props) {
    return (<table>
              <tbody>
              {[...Array(4)].map((_, i) =>
                <tr key={i}>
                {[...Array(4)].map((_, j) =>
                  <td key={4 * i + j}>
                    <Dice diceIdx={4 * i + j} {...props}/>
                  </td>
                )}
                </tr>
              )}
              </tbody>
            </table>);
}

function Timer(props) {
    const mins = Math.floor(props.gameSecondsRemaining / 60);
    const secs = props.gameSecondsRemaining % 60;

    return <div id='timer'
                style={props.gameSecondsRemaining < 21 ?
                       {backgroundColor: 'red'} : {}}>
             0{mins} : {(secs < 10 ? '0' : '')}{secs}
           </div>;
}

function GameView(props) {
    if (props.gameState == GameStates.PLAYING_GAME) {
        return (<div id='pageContainer'>
                  <div id='board'>

                    <Board {...props} />

                    <table id='activeWordBuildingArea'><thead>
                      <tr>
                        <td id='activeWordCell'>{props.activeWord}</td>
                        <td className='activeWordButtonCell'>
                          <img src='/images/yes.png'
                               className='activeWordButtonImage'
                               onClick={props.onWordSubmit}
                               id='yesButton'
                          />
                        </td>
                        <td className='activeWordButtonCell'>
                          <img src='/images/no.png'
                               className='activeWordButtonImage'
                               onClick={props.onWordCancel}
                               id='noButton'
                          />
                        </td>
                      </tr>
                    </thead></table>

                    <p id='smallScreenInstructions'>
                       Tap letters to build words. To submit a word tap the
                       green tick. To discard tap the red tick. To discard
                       only the last letter you selected, tap that dice
                       again.
                    </p>

                  </div>

                  <div id='userInfo'>

                    <Timer {...props} />

                    <p id='bigScreenInstructions'>
                      Enter words below:
                      <br/>
                      Hit enter to submit each word
                    </p>

                    <input type="text" id="enterWord"
                           value={props.activeWord}
                           onChange={e => props.wordChange(e.target.value)}
                           onKeyDown={e => {
                              if (e.key === 'Enter') {
                                  props.onWordSubmit();
                           }}}
                    />

                    <ul id='userWords'>
                      {props.wordList.map((w, i) =>
                        <li className='wordLi' key={i}>{w}</li>)}
                    </ul>

                    <input type='button'
                           value='Finish Early'
                           onClick={props.finishEarly}
                           id="finishEarly"
                    />
                </div>

              </div>
             );
    } else {
        return null;
    }
};

export default GameView;

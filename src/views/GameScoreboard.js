import React from 'react';
import GameStates from '../data/GameStates';
import WordList from './WordList';
import PlayerView from './PlayerView';
import Dice from './Dice';
import {reshape} from '../utils/reshape';
import splitBoard from '../utils/splitBoard';

function MiniBoard(props) {
    return (<table id='miniBoard'>
              <tbody>
              {[...Array(4)].map((_, i) =>
                <tr key={i}>
                {[...Array(4)].map((_, j) =>
                  <td key={4 * i + j}>
                    <Dice diceIdx={4 * i + j}
                          mini
                          activeBoard={splitBoard(props.scoreboard.board)}
                          activeDice={[]}/>
                  </td>
                )}
                </tr>
              )}
              </tbody>
            </table>);
}

function GameScoreboard(props) {
    if (props.gameState == GameStates.GAME_COMPLETE) {
        return (<div className='centreForegroundWide'>

                  <h1>Game #{props.scoreboard.gameID}</h1>

                  <div className='objectContainer'>
                    <MiniBoard {...props}/>
                    <p>Words available:</p>
                    <table className='wordList'>
                      <WordList {...props}/>
                    </table>
                  </div>
                
                  <table id='objectTable'>
                    <tbody>
                      {reshape(props.scoreboard.players, 2).map(r =>
                      <tr>
                         {r.map(p => <PlayerView player={p}/>)}
                      </tr>)}
                    </tbody>
                  </table>

                  <input type='button'
                         onClick={props.playAgain}
                         value='Play again'
                         name='playAgain'/>

                </div>
               );
    } else {
        return null;
    }
};

export default GameScoreboard;

import React from 'react';
import {reshape} from '../utils/reshape';

function PlayerView(props) {
    return (<td className='playerContainer'>
              <h6>{props.player.name}</h6>
              <p>Score: {props.player.score}</p>
              <p>Words: </p>
              <table className='wordList'>
                <tbody>
            {
                reshape(props.player.words, 2).
                    map((r, i) =>
                        <tr key={i}>
                          {r.map((w, j) =>
                                <React.Fragment>
                                  <td className={'wordCell' +
                                                 (props.player.words[2 * i + j].unique ?
                                                  ' onlyMine' : '') +
                                                 (props.player.words[2 * i + j].legit ?
                                                  ' legit' : 'notLegit')}
                                      key={i * 4 + j}>
                                    {props.player.words[2 * i + j].word}
                                  </td>
                                  <td key={i * 4 + j + 1} className='wordCell'>
                                    {props.player.words[2 * i + j].score}
                                  </td>
                                </React.Fragment>)}
                        </tr>)}
                </tbody>
              </table>
            </td>);
}

export default PlayerView;

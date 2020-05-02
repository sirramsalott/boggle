import React from 'react';
import {reshape} from '../utils/reshape';

function WordCell(props) {
    const w = props.scoreboard.possibleWords[props.wordIdx];
    return (<td className='wordCell'
                key={props.wordIdx}
            >
              <a target='_blank'
                key={props.wordIdx}
                href={'https://www.google.com/?#q=define%3A%20' + w}>
                {w}
              </a>
            </td>);
}

function WordList(props) {
    return (<tbody>
            {reshape(props.scoreboard.possibleWords, 3).
             map((a, j) =>
                 <tr key={j}>
                   {a.map((_, i) =>
                          <WordCell wordIdx={j * 3 + i}
                                    key={j * 3 + i}
                                    {...props}/>)}
                 </tr>)}
            </tbody>);
}

export default WordList;

import React from 'react';
import Timer from '../utils/timer';

function PupilView(props) {
    return(
        <div>
          <input
             type="text"
             value={props.textBox || ''}
             onChange={(e) => props.onTextChange(e.target.value)}
          />
          <input
             type="submit"
             onClick={(e) => props.onClick()}
          />
          <ul id="list">
            {[...props.listItems.map(v => <li key={v.key}>{v.val}</li>)]}
          </ul>

          <p>{props.time}</p>

          <Timer {...props} />

        </div>

    );
}

export default PupilView;


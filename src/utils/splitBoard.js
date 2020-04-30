import Immutable from 'immutable';

function splitBoard(s) {
    var b = Array();
    [...s].forEach(c => {
        if (c == 'u' && b.length > 0 && b[b.length - 1] == 'q') {
            b[b.length - 1] += 'u';
        } else {
            b.push(c);
        }
    });
    return Immutable.List(b);
}

export default splitBoard;

function reshape(a, rowLength) {
    var newA = [];
    var i = 0;
    while (i < a.length) {
        newA.push(a.slice(i, i + rowLength));
        i += rowLength;
    }
    return newA;
}

export {reshape};

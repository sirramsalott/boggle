function validEmail(string){
    var regex = /^\S+@\w+\.[a-z]+\.?[a-z]+$/;
    return regex.test(string);
};


function validDate(string){
    var regex = /^\d{4}-\d{2}-\d{2}$/;
    return regex.test(string);
};


function notEmptyNumeric(string){
    var regex = /^\d+$/;
    return regex.test(string);
};


function notEmpty(string){
    var regex = /^\S+$/;
    return regex.test(string);
};

function validForSQL(string){
    var regex = /^[^'|"|;]+$/;
    return regex.test(string);
};

function notEmptyLettersOnly(string){
    var regex = /^[a-z|A-Z]+$/;
    return regex.test(string);
};
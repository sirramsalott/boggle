$(document).ready(function(){
    setInterval(function(){ ellipses(); }, 1000);
});

function ellipses(){
    var dots = $("#ellipses");
    var numOfDots = dots.text().length;
    if (numOfDots == 3){
	numOfDots = 0;
    }
    else {
	numOfDots ++;
    };
    dots.html(stringMultiply(".", numOfDots));
};

function stringMultiply(string, number){
    var newString = "";
    for (var i = 0; i < number; i++){
	newString = newString.concat(string);
    };
    return newString;
};
	

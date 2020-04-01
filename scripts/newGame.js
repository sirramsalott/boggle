submitPage = "<img id='boggleLogo' src='../images/boggleLogo.png'><script src='../scripts/ellipses.js'></script><div class='centreForeground' style='height: 150px;'><h3 style='margin: 30px auto 0;'>Submitting your game</h3><h1 id='ellipses' style='margin: 0 auto 20px;'></h1></div>";

activeDice = new Array();
activeWord = "";

$(document).ready(function(){
    $("#textBox").focus();
    GlobalTimer = setInterval(function(){ tick(); }, 1000 );
});

function enter(){
    var word = $("input[name='enterWord']").val();
	$("input[name='enterWord']").val("");
	
	if (notEmptyLettersOnly(word)){
		$("#userWords").append("<li class='wordLi'>" + word + "</li>");
		var currentWordList = $("input[name='wordList']").val();
		$("input[name='wordList']").val(currentWordList + word.toLowerCase() + "#");
	}
	else {
		alert("Please enter words as letters only");
	};
};

function finishGame(){
	clearInterval(GlobalTimer);
	$("input[name='enterWord']").attr("readonly", "true");
	$("form[name=submitGame]").submit();
	$("body").html(submitPage);
}

function tick(){
    var timer = $( "#timer" );
    var time = unformatTime( timer.html() );
    if(time > 0){
	var t = formatTime( time - 1 );
	timer.html(t);
	
	if (time < 21){timer.css("background-color", "#ff0000");}
    }
    else {
	finishGame();
    };
};


function formatTime(time){
    var mins = Math.floor( time/60 );
    if ( mins < 10 ) {
        mins = "0" + mins;
    };
    var secs = time % 60;
    if (secs < 10 ){
        secs = "0" + secs;
    };
    return mins + ":" + secs;
};


function unformatTime(time){
    var timeArray = time.split(":");
    return parseInt(timeArray[0]*60) + parseInt(timeArray[1]);
};

function addLetter(c, diceIdx){
    if (activeDice.slice(0, activeDice.length - 1).includes(diceIdx)) {
	return;
    }
    if (activeDice[activeDice.length - 1] == diceIdx) {
	activeDice.pop();
	activeWord = activeWord.slice(0, activeWord.length - 1);
	if (activeWord.charAt(activeWord.length - 1) == "q") {
	    activeDice.pop();
	    activeWord = activeWord.slice(0, activeWord.length - 1);
	}
	$("#dice" + diceIdx).css("filter", "none");
    } else if (!activeDice.slice(0, activeDice.length - 1).includes(diceIdx)) {
	activeDice.push(diceIdx);
	activeWord = activeWord.concat(c);
	$("#dice" + diceIdx).css("filter", "sepia(100%) saturate(300%) brightness(70%) hue-rotate(180deg)");
    }
    $("#activeWordCell").text(activeWord);
}

function acceptWord(){
    if (notEmptyLettersOnly(activeWord)) {
	$("#userWords").append("<li class='wordLi'>" + activeWord + "</li>");
	var currentWordList = $("input[name='wordList']").val();
	$("input[name='wordList']").val(currentWordList + activeWord + "#");
	discardWord();
    }
}

function discardWord(){
    activeWord = "";
    activeDice.forEach(function(c){
	$("#dice" + c).css("filter", "none");
    });
    activeDice = Array();
    $("#activeWordCell").text("");
}

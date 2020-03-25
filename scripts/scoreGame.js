$(document).ready(function(){
    GameID = $("input[name='gameID']").val();
    GlobalTime = setInterval(function(){allPlayersScored();}, 1000);
});

function allPlayersScored(){
    $.get("allPlayersScored.py", {"gameID":GameID, "date": new Date().getTime()}, function(data){
	if (data=="True\n"){
	    clearInterval(GlobalTime);
	    $("form[name='viewGame']").submit();
	};
    });
};
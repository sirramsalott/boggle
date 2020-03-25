$(document).ready(function(){
    GameID = $("input[name='gameID']").val()
    GlobalTime = setInterval(function(){allPlayersSubmitted();}, 1000);
});


function allPlayersSubmitted(){
    $.get("allPlayersSubmitted.py", {"gameID":GameID, "date": new Date().getTime()}, function(data){
	if (data=="True\n"){
	    clearInterval(GlobalTime);
	    $("form[name='scoreGame']").submit();
	};
    });
};
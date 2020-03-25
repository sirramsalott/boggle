$(document).ready(function(){
    PupilID = $("input[name=pupilID]").val();
    console.log(PupilID);
    //Set faster if on a more powerful machine
    GlobalTime = setInterval(function(){ askForGame(); }, 3000);
});

function askForGame(){
    $.get("askForGame.py", {"pupilID": PupilID, "date": new Date().getTime()}, function(data){
	success = data.split(":");
	if (success[0]=="Found"){
	    clearInterval(GlobalTime);
	    $("input[name='gameID']").val(success[1]);
	    $("form[name='goToNewGame']").submit()
	};
    });
};

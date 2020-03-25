$(document).ready(function(){
    TeacherID = $("input[name='teacherID']").val();
    getWaitingPupils();
  
    $("button[name='refresh']").click(function(){
	getWaitingPupils();
    }); 

});    

function getWaitingPupils(){
    $.get("findFreePupils.py", {"teacherID":TeacherID}, function(data){
	$("#pupilTable").html(data);
    });
};

function choosePupils(){
    var checkedPupils = getCheckedPupils();
    var serializedCheckedPupils = serializeArray(checkedPupils);
    $("#createGameSuccess").html("Initiating game. Please wait");

    $.get("initiateNewGame.py", {"pupilList": serializedCheckedPupils}, function(data){
	$("#createGameSuccess").html(data);
	getWaitingPupils();
    });
};

function getCheckedPupils(){
    var checkedPupils = [];
    $("input[type='checkbox']").each(function(){
	if ($(this).is(":checked")){
	    var tr = $(this).parents("tr");
	    var pupilID = $(tr).find("td.pupilID").text();
	    checkedPupils.push(pupilID);
	};
    });
    return checkedPupils
};

function serializeArray(array){
    var serialized = "";
    for (var i = 0; i < array.length; i++){
	serialized = serialized.concat(array[i] + "#");
    };
    return serialized;
};

function addAWord(){
    var word = $("input[name='word']").val();
    var resultCell = $("#addWordSuccess");
    if ( /^[a-z]+$/.test(word) ) {
	resultCell.html("Please wait while this word is added");
	
	$.get("addAWord.py", {"word": word}, function(data){
	    resultCell.html(data);
	});
    }
    else {
	alert("Please enter a valid word, all in lower case");
    };
};
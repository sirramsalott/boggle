$(document).ready(function(){

    $("select[name='gameDataType']").change(function(){
	var form = $("form[name='searchGame']");
	var searchBy = $(this).val();
	if (searchBy == "date"){
            form.attr("action", "searchGame.py");
	}
	else {
            form.attr("action", "viewGame.py");
	};
    });
    
    $("select[name='pupilDataType']").change(function(){
	var form = $("form[name='searchPupil']");
	var searchBy = $(this).val();
	if (searchBy == "pupilID"){
            form.attr("action", "viewPupil.py");
	}
	else {
            form.attr("action", "searchPupil.py");
	};
    });
    
    $("form[name='searchPupil']").submit(function(event){
	if (! validatePupilSearch()){
	    event.preventDefault();
	};
    });

    $("form[name='searchGame']").submit(function(event){
	if (! validateGameSearch()){
	    event.preventDefault();
	};
    });

});

function validateGameSearch(){
    var form = $("form[name='searchGame']");
    var searchQuery = $("input[name='gameSearchData']").val();
    var searchBy = $("select[name='gameDataType']").val();

    if (searchBy == "date"){
	if (validDate(searchQuery)){
	    return true
	}
	else {
	    alert("Please enter dates in the format YYYY-MM-DD");
	    return false
	}
    }
    else {
	if (notEmptyNumeric(searchQuery)){
	    return true;
	}
	else {
	    alert("Please enter a number");
            return false;
	}
    }
};

function validatePupilSearch(){
    var form = $("form[name='searchPupil']");
    var searchQuery = $("input[name='pupilSearchData']").val();
    var searchBy = $("select[name='pupilDataType']").val();

    if (searchBy == "pupilID"){
        if (notEmptyNumeric(searchQuery)){
            return true
        }
        else {
            alert("Please enter a number");
            return false;
        };
    }
    else {
        if (validForSQL(searchQuery)){
	    return true;
        }
        else {

            alert("Please do not not use special characters (' \u0022 ;) in your query");
            return false;
        };
    };
};
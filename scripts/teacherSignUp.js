function validateSignUp(){
    var email = $("input[name='email']").val();
    var forename = $("input[name='forename']").val();
    var surname = $("input[name='surname']").val();
    var username = $("input[name='username']").val();
    
    if (! validEmail(email) && email.length < 33){
	alert("Please enter a valid email address using 32 characters or fewer");
    }
    else if (! (notEmptyLettersOnly(forename) && forename.length < 17)){
	alert("Please enter your first name as letters only, using no more than 16 characters");
    }
    else if (! (notEmptyLettersOnly(surname) && surname.length < 17)){
	alert("Please enter your surname as letters only, using no more than 16 characters");
    }
    else if (! (validForSQL(username) && username.length < 17)){
	alert("Please do not use special characters (' \" ;) in your username, using 16 characters or fewer");
    }
    else {
	$("form[name='signUp']").submit();
    };
};

$("input").keydown(function(){
    if (e.which == 13){
	validatePupilSearch();
    };
});

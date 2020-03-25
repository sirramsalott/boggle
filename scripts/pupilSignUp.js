function validateSignUp(){
    var teacherID = $("input[name='teacherID']").val();
    var forename = $("input[name='forename']").val();
    var surname = $("input[name='surname']").val();
    var username = $("input[name='username']").val();
    var password = $("input[name='password']").val();
    var confirmPassword = $("input[name='confirmPassword']").val();

    if (! notEmptyNumeric(teacherID)){
	alert("Please enter a number for teacher ID. If you don't know it, ask your teacher");
    }
    else if (! (notEmptyLettersOnly(forename) && forename.length < 17)){
	alert("Please enter your first name as letters only, using no more than 16 characters");
    }
    else if (! (notEmptyLettersOnly(surname) && surname.length < 17)){
	alert("Please enter your surname as letters only, using no more than 16 characters");
    }
    else if (! (validForSQL(username) && username.length < 17)){
	alert("Please do not use special characters (' \u0022 ;) in your username, using 16 characters or fewer");
    }
    else if (password == ""){
	alert("Please enter a password");
    }
    else if (password != confirmPassword){
	alert("Your passwords do not match");
    }
    else {
	$("form[name='signUp']").submit();
    };
};

$("input").keydown(function(){
    if (e.which == 13){
	validateSignUp();
    };
});
function getUserID() {
    const userType = $("input[name='userType']:checked").val();
    const username = $("input[name='username']").val();
    var loginPrompt = $("#loginPrompt");
    loginPrompt.css("visibility", "visible");
    loginPrompt.text("Logging in");

    $.get("cgi-bin/getUserID.py", 
	  {"userType" : userType,
	   "username":  username},
	  function(data) {
	      if (data == "None\n") {
		  loginPrompt.text("No " + userType.toLowerCase() + " found with that username");
	      } else {
                  const isPupil = userType == "Pupil";
                  if (isPupil) {
                      localStorage.setItem("pupilID", data.slice(0, -1));
                  }
		  $("form[name='executeLogin']").attr("action",
						      isPupil ?
						            "pupil.html" :
						            "cgi-bin/teacherHomepage.py");
		  $("input[name='successData']").attr("value", data);

		  $("form[name='executeLogin']").submit();
	      }
	  });
}

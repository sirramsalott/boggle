#!/usr/bin/python
import cgi, cgitb, sys
cgitb.enable()
sys.path.append("/var/www/cgi-bin")
from boggleUser import Teacher, Pupil, errorPage


page = """Content-type: text/html

<html>

  <head>

    <script src="../scripts/jquery.js"></script>
    <script src="../scripts/verifyLogin.js"></script>
    <meta charset="UTF-8">
    <link rel="stylesheet" type="text/css" href="../styles/boggleStyles.css">

  </head>

  <body>

    <div id="pageContainer">

      <a href="..">
        <img id="boggleLogo" src="../images/boggleLogo.png">
      </a>      

      <div class="centreForeground">

        <h2>Redirecting...</h2>

        <form name="executeLogin" method="post" action="%s">

          <input type="hidden" name="successData" value="%s">
          Click here if not redirected within 10 seconds:
          <input type="submit">

        </form>

      </div>

    </div>
 
 </body>

</html>"""

try:
    post = cgi.FieldStorage()
    
    if "userType" in post:
        try:
            if post["userType"].value == "Pupil":
                user = Pupil(username = post["username"].value)
                outgoingData = str(user.pupilID)
                target = "pupilHomepage.py"
                
            else:
                user = Teacher(username = post["username"].value)
                outgoingData = str(user.teacherID)
                target = "teacherHomepage.py"
                
                
        except Exception as e:
            target = "loginFailure.py"
            
            if e[0] == "User not found":
                outgoingData = "No user found with this username"
                
            else:
                raise e
                
        else:
            if not user.verifyLogin(post["password"].value):
                target = "loginFailure.py"
                outgoingData = "Password incorrect"

    else:
        target = "loginFailure.py"
        outgoingData = "Please select a user type"
        
    print page%(target, outgoingData)


except Exception as e:
    page = errorPage()

    print page%("", str(e))

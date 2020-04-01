#!/usr/bin/python
import cgi, cgitb, sys
cgitb.enable()
sys.path.append("/var/www/cgi-bin")
from boggleUser import Teacher, Pupil, errorPage


page = """Content-type: text/html

<html>

  <head>

    <meta charset="UTF-8">
    <title>Sign-up confirmation</title>
    <link rel="stylesheet" type="text/css" href="../styles/boggleStyles.css">

  </head>

  </body>

    <div id="pageContainer">

      
      <a href="..">
	<img id="boggleLogo" src="../images/boggleLogo.png">
      </a>      

      <a href="..">
	<div class="centreForeground" style="font-size: 20px;">
	  Go home
	</div>
      </a>

      <div class="centreForeground">

        <h3>
          %s
        </h3>

      </div>

    </div>

  </body>

</html>"""


try:
    post = cgi.FieldStorage()
    
    if "email" in post:
        newUser = Teacher(post["email"].value,
                          post["username"].value,
                          post["forename"].value,
                          post["surname"].value)
    else:
        newUser = Pupil(int(post["teacherID"].value),
                        post["username"].value,
                        post["forename"].value,
                        post["surname"].value)
        
        
    successMessage = newUser.save()
    
    print page%successMessage

except Exception as e:
    page = errorPage()
    print page%("", str(e))

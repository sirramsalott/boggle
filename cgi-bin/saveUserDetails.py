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
    isTeacher = "email" in post

    if isTeacher:
        newUser = Teacher(post["email"].value,
                          post["username"].value,
                          post["forename"].value,
                          post["surname"].value)
    else:
        newUser = Pupil(post["username"].value,
                        post["forename"].value,
                        post["surname"].value)

    successMessage = newUser.save()
    if not isTeacher:
        newUser.addTeacher(post["teacherID"].value)
    
    print page%successMessage

except Exception as e:
    if e[0] == 1452:
        print page%("A key constraint failed. If you signed up as a pupil this is probably because teacher {} does not exist. Get your teacher to find you from their control panel".format(post["teacherID"].value))
    else:
        page = errorPage()
        print page%("", str(e))

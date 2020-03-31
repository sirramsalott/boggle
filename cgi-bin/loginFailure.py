#!/usr/bin/python
import cgi, cgitb, sys
cgitb.enable()
sys.path.append("/var/www/cgi-bin")
from boggleUser import errorPage

    
page = """Content-type: text/html

<html>

  <head>
    
    <title>Login failed</title>
    <link rel="stylesheet" type="text/css" href="../styles/boggleStyles.css">
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">

  </head>

  <body>

    <div id="pageContainer">

      <a href="..">
	<img id="boggleLogo" src="../images/boggleLogo.png">
      </a>      
      
      <a href="..">
	<div class="centreForeground" id="homeBar">
	  Go home
	</div>
      </a>
      
      <div class="centreForeground">
    
        <h2>
          %s
        </h2>

        <h3>
          Click <a href="..">here</a> to try again.
        </h3>

      </div>

    </div>

  </body>

</html>"""


try:
    post = cgi.FieldStorage()
    
    print page%(post["successData"].value)

except Exception as e:
    page = errorPage()
    print page%("", str(e))

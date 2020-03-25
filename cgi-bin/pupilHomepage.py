#!/usr/bin/python
import cgi, cgitb, sys
cgitb.enable()
sys.path.append("/var/www/cgi-bin")
from boggleUser import Pupil, errorPage


page = """Content-type: text/html

<html>

  <head>

    <title>Pupil Homepage</title>
    <script src="../scripts/jquery.js"></script>
    <script src="../scripts/pupilHomepage.js"></script>
    <script src="../scripts/ellipses.js"></script>
    <link rel="stylesheet" type="text/css" href="../styles/boggleStyles.css">
    <meta charset="UTF-8">

  </head>

  <body>

    <div id="pageContainer">

      <img id="boggleLogo" src="../images/boggleLogo.png">

      <div class="centreForeground" style="height: 300px;">

        <h2 align="center">Please wait while you are connected to a game</h2>

        <h1 align="center" id="ellipses"></h1>

        <form name="askForGame">
          <input type="hidden" name="pupilID" value="%d">
        </form>

        <form name="goToNewGame" action="newGame.py" method="post">
          <input type="hidden" name="gameID">
          <input type="hidden" name="pupilID" value="%d">
        </form>

      </div>

    </div>

  </body>
</html>"""

try:
    post = cgi.FieldStorage()
    
    pupilID = int(post["successData"].value)
    pupil = Pupil(pupilID=pupilID)
    pupil.isWaiting(True)
    
    print page%(pupil.pupilID, pupil.pupilID)

except Exception as e:
    page = errorPage()
    print page%("", str(e))

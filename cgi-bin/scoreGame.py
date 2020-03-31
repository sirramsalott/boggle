#!/usr/bin/python
import cgitb, cgi, sys
cgitb.enable()
sys.path.append("/var/www/cgi-bin")
from boggleUser import Player, errorPage


page = """Content-type: text/html

<html>

  <head>

    <meta charset="UTF-8">
    <title>Collecting all scores</title>
    <script src="../scripts/jquery.js"></script>
    <script src="../scripts/scoreGame.js"></script>
    <script src="../scripts/ellipses.js"></script>
    <link rel="stylesheet" type="text/css" href="../styles/boggleStyles.css">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">

  </head>

  <body>

    <div id="pageContainer">
     
      <img id="boggleLogo" src="../images/boggleLogo.png">

      <div class="centreForeground" style="height: 150px;">

	<h3 style="margin: 30px auto 0;">Collecting all scores</h3>
	<h1 id="ellipses" style="margin: 0 auto 20px;"></h1>

        <form name="viewGame" action="viewGame.py" method="post">
          <input type="hidden" name="gameID" value="%d">
          <input type="hidden" name="pupilID" value="%d">
        </form>

      </div>

    </div>

  </body>

</html>"""


try:
    post = cgi.FieldStorage()
    
    pupilID = int(post["pupilID"].value)
    gameID = int(post["gameID"].value)
    
    player = Player(pupilID, gameID, True)
    player.scoreGame()
    
    print page%(gameID, pupilID)

except Exception as e:
    page = errorPage()
    print page%("", str(e))

#!/usr/bin/python
import cgi, cgitb, sys
cgitb.enable()
sys.path.append("/var/www/cgi-bin")
from boggleUser import Player, errorPage

page = """Content-type: text/html

<html>
  <head>

    <title>Waiting for players to submit</title>
    <meta charset="UTF-8">
    <script src="../scripts/jquery.js"></script>
    <script src="../scripts/submitGame.js"></script>
    <script src="../scripts/ellipses.js"></script>
    <link rel="stylesheet" type="text/css" href="../styles/boggleStyles.css">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">

  </head>

  <body>

    <div id="pageContainer">

      <img id="boggleLogo" src="../images/boggleLogo.png">

      <div class="centreForeground" style="height: 180px">

        <form name="scoreGame" action="scoreGame.py" method="post">
          <input type="hidden" name="pupilID" value="%d">
          <input type="hidden" name="gameID" value="%d">
        </form>

        <h3>Waiting for other players to submit</h3>
        <h1 id="ellipses" style="margin: 0 auto 20px;"></h1>

      </div>

    </div>

  </body>
</html>"""

try:
    post = cgi.FieldStorage()
    pupilID = int(post["pupilID"].value)
    gameID = int(post["gameID"].value)
    if "wordList" in post:
        pupilWordList = post["wordList"].value.split("#")[:-1]
    
    else:
        pupilWordList = []

        
    player = Player(pupilID, gameID, "from database")
    player.submit(pupilWordList)
    
    print page%(player.pupilID, player.gameID)
    
except Exception as e:
    page = errorPage()
    print page%("", str(e))

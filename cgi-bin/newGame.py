#!/usr/bin/python
import cgi, cgitb, sys
cgitb.enable
sys.path.append("/var/www/cgi-bin")
from boggleGame import Game
from boggleUser import Pupil, errorPage


page = """Content-type: text/html

<html>
<head>

  <title>New Boggle Game</title>
  <link type="text/css" rel="stylesheet" href="../styles/boggleStyles.css">
  <link type="text/css" rel="stylesheet" href="../styles/newGame.css">
  <script src="../scripts/jquery.js"></script>
  <script src="../scripts/validate.js"></script>
  <script src="../scripts/newGame.js"></script>
  <meta charset="UTF-8">

</head>


<body>
 
  <form name="submitGame" action="submitGame.py" method="post">

    <input name="pupilID" type="hidden" value="%d">
    <input name="gameID" type="hidden" value="%d">
    <input name="wordList" type="hidden" value="">

  </form>


  <div id="pageContainer">

    <div id="board">

      <table>
        %s
      </table>

    </div>


    <div id="userInfo">
      
      <div id="timer">
         03:00
      </div>
      
      <p>Enter words below:<br>Hit enter to submit each word</p>
      <form action="javascript:enter()">
	<input type="text" name="enterWord">
      </form>
      
      <ul id="userWords">
      </ul>

    </div>


  </div>

</body>
</html>
"""

try:
    post = cgi.FieldStorage()
    gameID = int(post["gameID"].value)
    pupilID = int(post["pupilID"].value)
    
    game = Game(gameID)
    pupil = Pupil(pupilID=pupilID)
    pupil.isWaiting(False)

    print page%(pupil.pupilID, game.gameID, game.boardToHTML())


except Exception as e:
    page = errorPage()
    print page%("", str(e))

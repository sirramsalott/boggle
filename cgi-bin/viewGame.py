#!/usr/bin/python
import cgi, cgitb, sys, os, Cookie
cgitb.enable()
sys.path.append("/var/www/cgi-bin")
from boggleGame import Game
from boggleUser import Player, teacherMenuBar, errorPage


page = """Content-type: text/html

<html>

  <head>
    
    <meta charset="UTF-8">
    <title> View Game %d </title>
    <link rel="stylesheet" type="text/css" href="../styles/boggleStyles.css">
    <link rel="stylesheet" type="text/css" href="../styles/searchAndView.css">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">

  </head>

  <body>
    <div id='pageContainer'>

      <a href="/">
        <img id="boggleLogo" src="../images/boggleLogo.png">
      </a>

      %s

    </div>

  </body>

</html>"""
teacherID = None

try:
    post = cgi.FieldStorage()
    if "gameID" in post:
        gameID = int(post["gameID"].value)
    
    elif "gameSearchData" in post:
        gameID = int(post["gameSearchData"].value)
    
    else:
        raise Exception("No game selected")

    body = ""
    if "HTTP_COOKIE" in os.environ:
        cookieString = os.environ.get("HTTP_COOKIE")
        cookie = Cookie.SimpleCookie()
        cookie.load(cookieString)

        if "teacherID" in cookie:
            teacherID = int(cookie["teacherID"].value)
            body = teacherMenuBar()

    elif not "pupilID" in post:
        raise Exception("You do not have permission to view this page")

    game = Game(gameID)
    
    if teacherID is None:
        body += "<a href='/'><div class='centreForeground' style='font-size: 20px;'>Go home</div></a>"
        
    body += "<div class='centreForegroundWide' style='overflow: hidden'>"
    body += "<h1>Game #" + str(gameID) + "</h1>"
    body += "<div class='objectContainer'>" + game.gameToHTML(teacherID) + game.wordTable() + "</div>"
    
    playerList = [Player(playerID, gameID, True) for playerID in game.players()]
    body += "<table id='objectTable'>"
    
    for i in range(len(playerList)):
        if i % 3 == 0:
            body += "<tr>"
            
        body += "<td class='playerContainer'>" + playerList[i].pupilToHTML(teacherID) + "</td>"
            
        if i % 3 == 2 or i == len(playerList) - 1:
            body += "</tr>"
            
    body += "</table>"

    if "pupilID" in post:
         body += """
                 <form method="post" action="pupilHomepage.py" class="playAgain">
                   <input type="hidden" name="successData" value="{}">
                   <button type="submit" name="playAgainButton" id="playAgainButton">
                     Play again
                   </button>
                 </form>
""".format(post["pupilID"].value)
    body += "</div>"

    print page%(gameID, body)

except Exception as e:
    page = errorPage()
    if teacherID is None:
        print page%("", str(e))
    
    else:
        print page%(teacherMenuBar(), str(e))

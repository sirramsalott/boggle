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

  </head>

  <body>
    <div id='pageContainer'>

      <img id="boggleLogo" src="../images/boggleLogo.png">

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
    
    if "HTTP_COOKIE" in os.environ:
        cookieString = os.environ.get("HTTP_COOKIE")
        cookie = Cookie.SimpleCookie()
        cookie.load(cookieString)

        if "teacherID" in cookie:
            teacherID = int(cookie["teacherID"].value)
            body = teacherMenuBar()

        else:
            raise Exception("A cookie expired")

    elif not "pupilID" in post:
        raise Exception("You do not have permission to view this page")

    else:
        body = ""

    game = Game(gameID)
    
    if teacherID is None:
        body += "<a href='/'><div class='centreForeground' style='font-size: 20px;'>Go home</div></a>"
        
    body += "<div class='centreForegroundWide' style='overflow: hidden'>"
    body += "<h1>Game Data For Game #" + str(gameID) + "</h1>"
    body += "<div class='objectContainer'>" + game.gameToHTML(teacherID) + game.wordTable() + "</div>"
    
    playerList = [Player(playerID, gameID, True) for playerID in game.players()]
    body += "<table id='objectTable'>"
    
    for i in range(len(playerList)):
        if i % 3 == 0:
            body += "<tr>"
            
        body += "<td class='objectContainer'>" + playerList[i].pupilToHTML(teacherID) + "</td>"
            
        if i % 3 == 2 or i == len(playerList) - 1:
            body += "</tr>"
            
    body += "</table></div>"

    print page%(gameID, body)

except Exception as e:
    page = errorPage()
    if teacherID is None:
        print page%("", str(e))
    
    else:
        print page%(teacherMenuBar(), str(e))

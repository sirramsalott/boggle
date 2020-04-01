#!/usr/bin/python
import cgi, cgitb, Cookie, os, sys
cgitb.enable()
sys.path.append("/var/www/cgi-bin")
from boggleUser import teacherMenuBar, errorPage
from boggleGame import getFromDatabase, Game

page = """Content-type: text/html

<html>

  <head>

    <title>Search for games</title>
    <meta charset='UTF-8'>
    <link rel="stylesheet" type="text/css" href="../styles/boggleStyles.css">
    <link rel="stylesheet" type="text/css" href="../styles/searchAndView.css">

  </head>

  <body>

    <div id='pageContainer'>

      <img id="boggleLogo" src="../images/boggleLogo.png">

        <!--TEACHER MENU BAR-->%s

        <div class="centreForegroundWide" style='margin: auto;'>

          <h1 align="center">Search Results</h1>

          <table id='objectTable' style='margin: auto;'>
            %s
          </table>

        </div>

    </div>

  </body>

</html>"""
resultTable = ""
teacherID = None


try:
    post = cgi.FieldStorage()
    
    if "HTTP_COOKIE" in os.environ:
        cookieString = os.environ.get("HTTP_COOKIE")
        cookie = Cookie.SimpleCookie()
        cookie.load(cookieString)
        
        if "teacherID" in cookie:
            teacherID = int(cookie["teacherID"].value)

        else:
            raise Exception("A cookie expired")
    
    else:
        raise Exception("You don't have permission to view this page")

    dateStarted = post["gameSearchData"].value
    
    sql = """SELECT DISTINCT game.gameID FROM game
             INNER JOIN player ON game.gameID=player.gameID
             INNER JOIN pupil ON player.pupilID=pupil.pupilID
             INNER JOIN teaches ON pupil.pupilID=teaches.pupilID
             WHERE game.dateStarted='%s' AND teaches.teacherID=%d;"""
    
    result = getFromDatabase(sql%(dateStarted, teacherID))
    gameList = [Game(row[0]) for row in result]

    for i in range(len(gameList)):
        if i % 3 == 0:
            resultTable += "<tr>"
        
        resultTable += "<td class='objectContainer'>" + gameList[i].gameToHTML(teacherID) + "<p>Players:</p>" + gameList[i].playerTable() + "</td>"

        if i % 3 == 2 or i == len(gameList) - 1:
            resultTable += "</tr>"

    print page%(teacherMenuBar(), resultTable)

except Exception as e:
    page = errorPage()
    if teacherID is None:
        print page%("", str(e))

    else:
        print page%(teacherMenuBar(), str(e))

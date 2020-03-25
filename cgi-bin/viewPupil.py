#!/usr/bin/python
import cgi, cgitb, sys, os, Cookie
cgitb.enable()
sys.path.append("/var/www/cgi-bin")
from boggleUser import Pupil, Player, teacherMenuBar, errorPage


page = """Content-type: text/html

<html>

  <head>

    <meta charset="UTF-8">
    <title>Pupil Data</title>
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
    if "pupilID" in post:
        pupilID = int(post["pupilID"].value)

    elif "pupilSearchData" in post:
        pupilID = int(post["pupilSearchData"].value)

    else:
        raise Exception("No pupil selected")
    
    if "HTTP_COOKIE" in os.environ:
        cookieString = os.environ.get("HTTP_COOKIE")
        c = Cookie.SimpleCookie()
        c.load(cookieString)
        
        if "teacherID" in c:
            teacherID = int(c["teacherID"].value)
            
        else:
            raise Exception("A cookie expired")
    
    else:
        raise Exception("You do not have permission to view this page")
        
        
    pupil = Pupil(pupilID=pupilID)
    
    if pupil.teacherID != teacherID:
        raise Exception("You do not have permission to view this page")

    playerList = pupil.players()
    
    if not teacherID is None:
        body = teacherMenuBar()

    else:
        body = "<a href='/'><div class='centreForeground' style='font-size: 20px;'>Go home</div></a>"

    body += "<div class='centreForegroundWide' style='overflow: hidden'>"
        
    body += "<h1>Pupil Data: %s %s </h1>"%(pupil.forename, pupil.surname)
    body += "<div class='objectContainer' style='margin-left: 34px;'>" + pupil.pupilToHTML() + "</div>"
    body += "<table id='objectTable'>"

    for i in range(len(playerList)):
        if i % 3 == 0:
            body += "<tr>"
        
        body += "<td class='objectContainer'>" + playerList[i].gameToHTML(teacherID) + "</td>"
        
        if i % 3 == 2 or i == len(playerList) - 1:
            body += "</tr>"

    body += "</table></div>"

    print page%body


except Exception as e:
    page = errorPage()

    if teacherID is None:
        print page%("", str(e))

    else:
        print page%(teacherMenuBar(), str(e))

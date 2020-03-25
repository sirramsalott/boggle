#!/usr/bin/python
import cgi, cgitb, sys, os, Cookie
cgitb.enable()
sys.path.append("/var/www/cgi-bin")
from boggleUser import Pupil, teacherMenuBar, errorPage
from boggleGame import getFromDatabase


page = """Content-type: text/html

<html>
 
  <head>

    <title>Search for pupils</title>
    <meta charset='UTF-8'>
    <link rel="stylesheet" type="text/css" href="../styles/boggleStyles.css">
    <link rel="stylesheet" type="text/css" href="../styles/searchAndView.css">

  </head>

  <body>

    <div id='pageContainer'>

      <img id="boggleLogo" src="../images/boggleLogo.png">

      <!--TEACHER MENU BAR-->%s
      
      <div class='centreForegroundWide' style='margin: auto;'>

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
        raise Exception("A cookie expired")
    
    searchBy = post["pupilDataType"].value
    searchData = post["pupilSearchData"].value.lower()
    
    result = getFromDatabase("SELECT pupilID FROM pupil WHERE LOWER(%s)='%s' AND teacherID=%d;"%(searchBy, searchData, teacherID))
    pupilList = [Pupil(pupilID=row[0]) for row in result]
    
    for i in range(len(pupilList)):
        if i % 3 == 0:
            resultTable += "<tr>"
            
        resultTable += "<td class='objectContainer'>" + pupilList[i].pupilToHTML(teacherID) + "</td>"

        if i % 3 == 2 or i == len(pupilList) - 1:
            resultTable += "</tr>"

    print page%(teacherMenuBar(), resultTable)


except Exception as e:
    page = errorPage()
    if teacherID is None:
        print page%("", str(e))

    else:
        print page%(teacherMenuBar, str(e))

#!/usr/bin/python
import cgi, cgitb, sys, Cookie, os
cgitb.enable()
sys.path.append("/var/www/cgi-bin")
from boggleUser import teacherMenuBar, errorPage


page = """Content-type: text/html

<html>

  <head>

    <title>Teacher Homepage</title>
    <script src="../scripts/jquery.js"></script>
    <script src="../scripts/teacherHomepage.js"></script>
    <link rel="stylesheet" type="text/css" href="../styles/boggleStyles.css">
    <meta charset="UTF-8">

  </head>


  <body>

    <div id="pageContainer" style="text-align: center;">

      <a href="/">
        <img id="boggleLogo" src="../images/boggleLogo.png">
      </a> 
    
      %s <!--TEACHER MENU BAR-->
      
      <div class="centreForegroundWide">

        <h1>
          Teacher Homepage: ID %d
        </h1>

        <button name="refresh" style="margin: auto;">Refresh pupil table</button><br>
 
        <table id="pupilTable">
          <!-- Filled in when free pupils are retrieved from database -->
        </table>
    

        <form name="choosePupils"  action="javascript:choosePupils()"1111>

        <input type="hidden" name="teacherID" value="%d">
        <input type="submit" value="Create Game">
 
        </form>


        <p id="createGameSuccess">
        </p>
  
      </div>

      <div class="centreForegroundWide">
        <form name="addAWord" action="javascript:addAWord()">
          
          <table>
            <tr>

              <td class="addWordCell"><input type="text" name="word"></td>
              <td class="addWordCell"><button style="float: left; margin-right: 100px;">Add this word to the lexicon</button></td>
              <td class="addWordCell" id="addWordSuccess"></td>

            </tr>
          </table>

        </form>

      </div>        

    </div>

  </body>
</html>"""
teacherID = None

try:
    post = cgi.FieldStorage()
    
    if "successData" in post: #Accessing homepage from login
        teacherID = int(post["successData"].value)
        newCookie = Cookie.SimpleCookie()
        newCookie["teacherID"] = str(teacherID)
        print newCookie

    elif "HTTP_COOKIE" in os.environ: #Accessing from another page
        cookieString = os.environ.get("HTTP_COOKIE")
        oldCookie = Cookie.SimpleCookie()
        oldCookie.load(cookieString)
        if "teacherID" in oldCookie:
            teacherID = int(oldCookie["teacherID"].value)
            
    else:
        raise Exception("You do not have permission to view this page")

    print page%(teacherMenuBar(), teacherID, teacherID)
    

except Exception as e:
    page = errorPage()

    if teacherID is None:
        print page%("", str(e))

    else:
        print page%(teacherMenuBar(), str(e))

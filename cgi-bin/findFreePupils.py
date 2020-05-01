#!/usr/bin/python
import cgi, cgitb, sys, MySQLdb, time
cgitb.enable()
sys.path.append("/var/www/cgi-bin")
from boggleUser import Pupil
from boggleGame import getFromDatabase


try:
    post = cgi.FieldStorage()
    teacherID = post["teacherID"].value
    
    result = getFromDatabase("""SELECT pupil.pupilID FROM pupil, teaches
                                WHERE teaches.teacherID='{}'
                                AND pupil.pupilID=teaches.pupilID
                                AND waitingForGame='True'
                                AND {} - lastSeen < 3
                                ORDER BY pupil.pupilID;""".
                             format(teacherID, time.time()))
    pupils = [Pupil(pupilID=row[0]) for row in result]
    
    pupilsTable = """<tr id='pupilTable'>
                       <th>Pupil ID</th>
                       <th>First Name</th>
                       <th>Surname</th>
                       <th>Average Score</th>
                       <th>Select</th>
                       <th>View Pupil</th>
                     <tr>"""

    for pupil in pupils:
        pupilsTable += pupil.generateTR()

    print pupilsTable

except Exception as e:
    print """<h1>
               An error occurred. Please contact system administrator with the following message if it persists.
             </h1>
             <h2 id='errorMessage'>
               %s
             </h2>"""%str(e)

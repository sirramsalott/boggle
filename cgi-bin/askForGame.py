#!/usr/bin/python
import cgi, cgitb, sys
cgitb.enable()
sys.path.append("/var/www/cgi-bin")
from boggleUser import Pupil

post = cgi.FieldStorage()
pupilID = int(post["pupilID"].value)

pupil = Pupil(pupilID=pupilID)
waitingPlayerID = pupil.findUnsubmittedPlayer()

if waitingPlayerID:
    print "Found:%d"%waitingPlayerID[0]

else:
    print "Not found:"

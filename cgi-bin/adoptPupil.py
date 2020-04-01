#!/usr/bin/python
import cgi, sys, os, Cookie
sys.path.append("/var/www/cgi-bin")
from boggleGame import sendToDatabase


try:
    post = cgi.FieldStorage()
    pupilID = post["pupilID"].value
    cookieString = os.environ.get("HTTP_COOKIE")
    c = Cookie.SimpleCookie()
    c.load(cookieString)
    teacherID = int(c["teacherID"].value)
    sendToDatabase("INSERT INTO teaches (pupilID, teacherID) VALUES ({}, {});".format(pupilID, teacherID))
    print("Done")
except Exception as e:
    if e[0] == 1062:
        print "Already adopted"
    else:
        print "Error: " + str(e)

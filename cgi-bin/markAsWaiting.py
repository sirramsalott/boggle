#!/usr/bin/python
import cgi, sys, json, cgitb
from boggleUser import Pupil

def response(pupilID):
    Pupil.markAsWaiting(pupilID, True)
    out = {"done": True}
    outJ = json.dumps(out)
    return """Status: 200 OK
Content-Type: application/json
Content-Length: {}

{}""".format(len(outJ), outJ)

if __name__ == '__main__':
    cgitb.enable()
    post = cgi.FieldStorage()
    print response(int(post['pupilID'].value))

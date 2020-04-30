#!/usr/bin/python
import cgi, sys, json, cgitb
from boggleUser import Pupil

def response(pupilID):
    g = Pupil.getWaitingGame(pupilID)
    out = {"found": bool(g)}
    if g:
        Pupil(pupilID=pupilID).isWaiting(False)
        out.update(g)
    outJ = json.dumps(out)

    return """Status: 200 OK
Content-Type: application/json
Content-Length: {}

{}""".format(len(outJ), outJ)

if __name__ == '__main__':
    cgitb.enable()
    post = cgi.FieldStorage()
    print response(int(post['pupilID'].value))

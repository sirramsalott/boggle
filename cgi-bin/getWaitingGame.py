#!/usr/bin/python
import cgi, sys, json
from boggleUser import Pupil

def response(pupilID):
    g = Pupil.getWaitingGame(pupilID)
    out = {"found": bool(g)}
    if g:
        out.update(g)
    outJ = json.dumps(out)

    return """Status: 200 OK
Content-Type: application/json
Content-Length: {}

{}""".format(len(outJ), outJ)

if __name__ == '__main__':
    post = cgi.FieldStorage()
    print response(int(post['pupilID'].value))

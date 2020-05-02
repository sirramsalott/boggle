#!/usr/bin/python
import cgi, cgitb, json
from boggleGame import Game

def response(gameID):
    g = Game(gameID)
    g.markAbsentPlayersSubmitted()
    out = json.dumps({"submitted": g.allPlayersSubmitted()})
    return """Status: 200 OK
Content-Type: application/json
Content-Length: {}

{}""".format(len(out), out)

if __name__ == "__main__":
    cgitb.enable()
    post = cgi.FieldStorage()
    print response(int(post["gameID"].value))

#!/usr/bin/python
import cgi, cgitb, json
cgitb.enable()
from boggleGame import Game

def response(gameID):
    out = json.dumps({"scored": Game(gameID).allPlayersScored()})
    return """Status: 200 OK
Content-Type: application/json
Content-Length: {}

{}""".format(len(out), out)

if __name__ == "__main__":
    post = cgi.FieldStorage()
    print response(int(post["gameID"].value))

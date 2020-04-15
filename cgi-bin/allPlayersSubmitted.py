#!/usr/bin/python
import cgi, json
from boggleGame import Game

def response(gameID):
    out = json.dumps({"submitted": Game(gameID).allPlayersSubmitted()})
    return """Status: 200 OK
Content-Type: application/json
Content-Length: {}

{}""".format(len(out), out)

if __name__ == "__main__":
    post = cgi.FieldStorage()
    print response(int(post["gameID"].value))

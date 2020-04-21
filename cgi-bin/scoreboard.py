#!/usr/bin/python
import cgi, cgitb, json
cgitb.enable()
from boggleGame import Game

def response(gameID):
    g = Game(gameID)
    available = g.allPlayersScored()
    out = {"available": available}
    if available:
        out.update({"gameID": gameID,
                    "board": "".join(l for sublist in g.board
                                       for l in sublist),
                    "date": g.dateStarted,
                    "possibleWords": g.possibleWords()})
    out = json.dumps(out)
    return """Status: 200 OK
Content-Type: application/json
Content-Length: {}

{}""".format(len(out), out)

if __name__ == "__main__":
    post = cgi.FieldStorage()
    print response(int(post["gameID"].value))

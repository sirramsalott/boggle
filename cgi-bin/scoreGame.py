#!/usr/bin/python
import cgitb, cgi, json
from boggleUser import Player
cgitb.enable()

def response(pupilID, gameID):
    player = Player(pupilID, gameID, "from database")
    player.scoreGame()
    out = json.dumps({"done": True})

    return """Status: 200 OK
Content-Type: application/json
Content-Length: {}

{}""".format(len(out), out)


if __name__ == "__main__":
    cgitb.enable()
    post = cgi.FieldStorage()
    print response(pupilID=int(post["pupilID"].value),
                   gameID=int(post["gameID"].value))

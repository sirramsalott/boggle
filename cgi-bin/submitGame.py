#!/usr/bin/python
import cgi, json
from boggleUser import Player


def response(pupilID, gameID, wordList):
    wordList = wordList.split("#")
    player = Player(pupilID, gameID, "from database")

    try:
        player.submit(wordList)
        done = True
    except MemoryError:
        done = False

    out = {"done": done}
    outJ = json.dumps(out)

    return """Status: 200 OK
Content-Type: application/json
Content-Length: {}

{}""".format(len(outJ), outJ)


if __name__ == "__main__":
    post = cgi.FieldStorage()
    wordList = post["wordList"].value if "wordList" in post else ""
    print response(pupilID=int(post["pupilID"].value),
                   gameID=int(post["gameID"].value),
                   wordList=wordList)

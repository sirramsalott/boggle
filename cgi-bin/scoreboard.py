#!/usr/bin/python
import cgi, cgitb, json
from boggleGame import Game
from boggleUser import Player, Pupil

def response(gameID):
    g = Game(gameID)
    g.markAbsentPlayersScored()
    available = g.allPlayersScored()
    out = {"available": available}
    if available:
        possibleWords = g.possibleWords()
        out.update({"gameID": gameID,
                    "board": "".join(l for sublist in g.board
                                       for l in sublist),
                    "date": g.dateStarted,
                    "possibleWords": possibleWords,
                    "players": []})

        for pupilID in g.players():
            p = Player(pupilID=pupilID,
                       gameID=gameID,
                       fromDatabase=True)
            pWords = p.allWords()
            otherWords = p.otherPlayersWords()
            pup = Pupil(pupilID=pupilID)
            out["players"].append(
                {"name": "{} {}".format(pup.forename, pup.surname),
                 "score": p.score,
                 "words": [{"word": w,
                            "unique": w not in otherWords,
                            "legit": l and w in possibleWords,
                            "score": p.wordScore((w, l), pWords, otherWords)}
                           for w, l in pWords]
                 })

    out = json.dumps(out)
    return """Status: 200 OK
Content-Type: application/json
Content-Length: {}

{}""".format(len(out), out)

if __name__ == "__main__":
    cgitb.enable()
    post = cgi.FieldStorage()
    print response(int(post["gameID"].value))

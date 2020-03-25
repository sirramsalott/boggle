#!/usr/bin/python
import cgi, cgitb, sys
cgitb.enable()
sys.path.append("/var/www/cgi-bin")
from boggleGame import Game
from boggleUser import Player


def initGame(pupilList):
    try:
        newGame = Game()
        gameID = newGame.save()
        newGame.setGameID(gameID)
        newGame.insertBoardWords()
    
    except Exception as e:
        message = "An error occurred. Please contact system administrator with the following message: <br> %s"%(e[0])
    
    else:
        for pupilID in pupilList:
            newPlayer = Player(pupilID, newGame.gameID)
            
            try:
                newPlayer.save()
            
            except Exception as e:
                message = """An error occurred. Please contact system administrator with the following message:
                                    <br> %s"""%(str(e))

            else:
                message = "Pupils matched to game #%d"%(newGame.gameID)

    return message


post = cgi.FieldStorage()

if "pupilList" in post: #Teacher has selected at least one pupil
    pupilList = [int(pupilID) for pupilID in post["pupilList"].value.split("#")[:-1]]
    successMessage = initGame(pupilList)

else:
    successMessage = "No pupils selected"

print successMessage

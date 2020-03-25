#!/usr/bin/python
import cgi, cgitb, sys
cgitb.enable()
sys.path.append("/var/www/cgi-bin")
from boggleGame import Game

post = cgi.FieldStorage()
gameID = int(post["gameID"].value)

game = Game(gameID)

print str(game.allPlayersSubmitted())

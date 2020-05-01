#!/usr/bin/python
from random import randint
import MySQLdb, datetime, cPickle, sys, time
sys.path.append("/var/www/cgi-bin")
from wordTree import WordNode
from BoggleDB import BoggleDBCursor

'Contains functions and classes associated with playing the game, and general purpose functions for the database'

class Game(object):
    'Game class'

    def __init__(self, gameID=None):
        'Game constructor. Takes gameID if reading from database, generates new game if no parameters'
        
        if gameID: #Retrieve Game from the database
            self.gameID = gameID
            result = getFromDatabase("SELECT board, dateStarted FROM game WHERE gameID=%d;"%gameID)

            if len(result) > 0:
                self.board = deserializeBoard(result[0][0], [], 0)
                self.dateStarted = formatDate(result[0][1])

            else:
                raise Exception("Game not found")
            
        else: #Create new Game
            self.board = generateBoard()
            self.dateStarted = dateNow()

            
    def __repr__(self):
        'Print game in the command line'
        print str(self.gameID)
        printBoard(self.board)
        return self.dateStarted

    
    def save(self):
        'Insert game into database'
        #sendToDatabase not used so that LAST_INSERT_ID can run
        database = MySQLdb.connect("localhost", "joe", "joesql", "boggle")
        database.autocommit(True)
        cursor = database.cursor()

        sql = "INSERT INTO game (dateStarted, board) VALUES ('%s', '%s');"%(self.dateStarted, self.serializeBoard())
        cursor.execute(sql)

        sql = "SELECT LAST_INSERT_ID();"
        cursor.execute(sql)
        gameID = cursor.fetchone()[0]

        cursor.close()
        database.close()

        return gameID

        
    def setGameID(self, gameID):
        'Set gameID'
        self.gameID = gameID


    def serializeBoard(self):
        'Convert board as nested list into a string for the database'
        serializedBoard = ""
        for i in range(4):
            for j in range(4):
                serializedBoard += self.board[i][j]
        return serializedBoard


    def boardToHTML(self):
        'Convert board to the inner HTML of a table'
        HTMLtable = ""
        
        for i in range(4):
            HTMLtable += "<tr>"

            for j in range(4):
                HTMLtable += "<td><img src='../images/{0}.png' class='dice' id='dice{1}' onclick=\"addLetter('{0}', {1})\"></td>\n".format(self.board[i][j], i * 4 + j)

            HTMLtable += "</tr>"
    
        return HTMLtable


    def insertBoardWords(self):
        'Send all words in the board to the database'
        #sendToDatabase not used so the LAST_INSERT_ID can run
        wordList = self.playBoggle()
        database = MySQLdb.connect("localhost", "joe", "joesql", "boggle")
        cursor = database.cursor()
        database.autocommit(True)
 
        for word in wordList:
            sql = "SELECT wordID FROM word WHERE word='%s'"%word
            cursor.execute(sql)
            result = cursor.fetchone()

            if not result is None:
                wordID = result[0]
                
            else:
                cursor.execute("INSERT INTO word (word, isWord) VALUES ('%s', 'True');" % word)

                cursor.execute("SELECT LAST_INSERT_ID()")
                wordID = cursor.fetchone()[0]

            cursor.execute("INSERT INTO boardWord VALUES (%d, %d);" % (self.gameID, wordID))

        cursor.close()
        database.close()


    def playBoggle(self):
        'Extract all words from the board'
        foundWords = []
        wordTree = unPickleWordTree()
        
        for y in range(4):
            for x in range(4):
                
                extendWord(x, y, self.board, foundWords, wordTree)
                
        return foundWords


    def allPlayersSubmitted(self):
        'Check if all players with my gameID have submitted all their words'
        if existsInDatabase("SELECT * FROM player WHERE gameID=%d AND submitted='False';"%self.gameID):
            return False

        else:
            return True


    def allPlayersScored(self):
        'Check if all players with my gameID have a non-null score in the database'
        if existsInDatabase("SELECT * FROM player WHERE gameID=%d AND score IS NULL;"%self.gameID):
            return False

        else:
            return True


    def players(self):
        'Retrieve all players with my gameID from the database'
        result = getFromDatabase("SELECT pupilID FROM player WHERE gameID=%d ORDER BY score DESC;"%self.gameID)
        return [row[0] for row in result]

    
    def gameToHTML(self, teacherID=None):
        'Convert game to HTML for viewGame and searchGame. Does not output the list of words in the board'
        if not teacherID is None:
            element = "<p><a href='viewGame.py?gameID=%d'>ID: %d</a></p>"%(self.gameID, self.gameID)

        else:
            element = "<p>Game ID: %d </p>"%self.gameID

        element += "<table class='board'>"
        element += self.boardToHTML() + "</table>"
        element +=  "<p>Date Played: %s</p>"%self.dateStarted

        return element

    def possibleWords(self):
        result = getFromDatabase("""SELECT word.word FROM word INNER JOIN boardWord
                                    ON word.wordID=boardWord.wordID
                                    WHERE boardWord.gameID=%d ORDER BY word.word;"""%self.gameID)
        return [row[0] for row in result]

    def wordTable(self):
        'Convert the list of words in the board to HTML table'
        wordList = self.possibleWords()
        table = "<p>Words available: </p><table class='wordList'>"

        for i in range(len(wordList)):
            if i % 3 == 0:
                table += "<tr>"
            
            table += """<td class='wordCell'><a target='_blank' href='https://www.google.com/?#q=define%%3A%%20+%s'>
                        %s</a></td>"""%(wordList[i], wordList[i])

            if i % 3 == 2 or i == len(wordList) - 1:
                table += "</tr>"

        table += "</table>"
        return table


    def playerTable(self):
        'Convert list of players with my gameID to HTML table'
        sql = """SELECT pupil.forename, pupil.surname FROM pupil INNER JOIN player ON player.pupilID=pupil.pupilID
                 INNER JOIN game ON player.gameID=game.gameID WHERE game.gameID=%d;"""%self.gameID
        result = getFromDatabase(sql)
        table = "<table class='playerTable'>"
        for row in result:
            table += "<tr><td class='playerContainer'>%s %s</td></tr>"%(row[0], row[1])

        table += "</table>"
        return table

    def markAbsentPlayersSubmitted(self):
        with BoggleDBCursor() as cur:
            cur.execute("SELECT pupil.pupilID " \
                        "FROM player, pupil " \
                        "WHERE player.gameID = %s " \
                        "  AND player.pupilID = pupil.pupilID " \
                        "  AND %s - pupil.lastSeen > 25 " \
                        "  AND player.submitted = 'False'",
                        (self.gameID, time.time()))
            res = cur.fetchall()
            for r in res:
                cur.execute("UPDATE player SET submitted='True' " \
                            "WHERE pupilID = %s AND gameID = %s",
                            (r[0], self.gameID))

    def markAbsentPlayersScored(self):
        with BoggleDBCursor() as cur:
            cur.execute("SELECT pupil.pupilID FROM player, pupil " \
                        "WHERE player.gameID = %s " \
                        "  AND player.pupilID = pupil.pupilID " \
                        "  AND %s - pupil.lastSeen > 25 " \
                        "  AND player.score is null",
                        (self.gameID, time.time()))
            res = cur.fetchall()
            for r in res:
                cur.execute("UPDATE player SET score = 0 " \
                            "WHERE pupilID = %s AND gameID = %s",
                            (r[0], self.gameID))


class Face(str):
    'String with Boolean flag to ensure that paths through the board do not use the same dice twice'
    inUse = False


def dateNow():
    "Retrieve today's date and return in SQL format"
    now = datetime.datetime.now()
    return formatDate(now)


def formatDate(date):
    'Convert date to format valid for storing in the database'
    day = str(date.day)
    month = str(date.month)
    year = str(date.year)
    return year + "-" + month + "-" + day


def generateBoard():
    'Randomly generate a Boggle board'
    a = ['r', 'n', 'z', 'n', 'l', 'h']
    b = ['o', 'p', 'c', 'h', 'a', 's']
    c = ['e', 'a', 'g', 'a', 'n', 'e']
    d = ['l', 't', 'y', 'r', 'e', 't']
    e = ['s', 'k', 'f', 'f', 'a', 'p']
    f = ['j', 'a', 'o', 'b', 'o', 'b']
    g = ['e', 's', 'u', 'e', 'n', 'i']
    h = ['y', 'e', 'd', 'l', 'v', 'r']
    i = ['l', 'd', 'e', 'x', 'i', 'r']
    j = ['s', 't', 'o', 'e', 'i', 's']
    k = ['o', 't', 'w', 'o', 'a', 't']
    l = ['r', 'h', 't', 'v', 'w', 'e']
    m = ['n', 'e', 'e', 'h', 'w', 'g']
    n = ['t', 'y', 't', 'd', 'i', 's']
    o = ['i', 'u', 'n', 'h', 'm', 'qu']
    p = ['i', 'c', 't', 'u', 'm', 'o']
    die = [a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p]
    
    board = []
    used = []
    diceNumber = randint(0, 15)
    
    for outer in range(4):
        row=[]
        
        for inner in range(4):
            while diceNumber in used:
                
                diceNumber = randint(0, 15)
                
            letter = rollDice(die[diceNumber])
            row.append(Face(letter))
            used.append(diceNumber)
            
        board.append(row)
    
    return board
            

def printBoard(board):
    'Print the board readably in the command line. Use boardToHTML for output to user'
    for row in board:
        line = []

        for face in row:
            line.append(face)
        print " ".join(line)

	
def rollDice(dice):
    'Return the letter at a randomly select node of the dice list'
    face = randint(0, 5)
    return dice[face]


def deserializeBoard(linearBoard, board, i):
    'Convert serialized board to nested list'
    if i < len(linearBoard):
    
        if not board:
            board.append([])
        elif len(board[len(board) - 1]) == 4:
            board.append([])
            
        if linearBoard[i] == "q":
            board[len(board) - 1].append(Face(linearBoard[i:i+2]))
            i += 2

        else:
            board[len(board) - 1].append(Face(linearBoard[i]))
            i += 1

        board = deserializeBoard(linearBoard, board, i)

    return board


def onBoard(x, y):
    'Are these two coordinates within the bounds of the board?'
    if 0<=x<=3 and 0<=y<=3:
        return True
    else:
        return False


def checkForWords(word, node, foundWords, i=0, buildingWord=""):
    'Are there are any words which start with this set of letters? ie: is it worth pursuing this path? And update the list of found words'
    worthLooking = True

    if i < len(word):
        
        if word[i] not in node:
            worthLooking = False

        else:
            buildingWord += word[i]

            if node[word[i]].isWord and buildingWord not in foundWords:
                foundWords.append(buildingWord)

            worthLooking = checkForWords(word, node[word[i]], foundWords, i+1, buildingWord)

    return worthLooking


def extendWord(x, y, board, foundWords, node, word=""):
    'Recursively pursue all paths through the board from a given dice, building possible words as you go'
    board[y][x].inUse = True
    word += board[y][x]
    
    for searchY in range(-1, 2):
        for searchX in range(-1, 2):
            
            nextX = x + searchX
            nextY = y + searchY

            if onBoard(nextX, nextY) and checkForWords(word, node, foundWords) and not board[nextY][nextX].inUse:

                extendWord(nextX, nextY, board, foundWords, node, word)

    board[y][x].inUse = False


def extendTree(node, word, index=-1):
    'Build the word tree from a list of words. Pass node as the root node of the tree, and word as each word in the lexicon list'
    if index < len(word) - 1:
        index += 1

        if word[index] not in node:
            node[word[index]] = WordNode()

        extendTree(node[word[index]], word, index)

    elif index == len(word) - 1:
        node.isWord = True


def buildWordTree(filename):
    'Build the word tree from a file of words in the current directory'
    rootNode = WordNode()
    with open(filename, "rb") as listFile:
        for word in listFile.read().split("\n"):
            extendTree(rootNode, word)
    return rootNode


def unPickleWordTree():
    'Read in the word tree from a serialized version'
    with open("wordTree.pkl", "rb") as treeFile:
        wordTree = cPickle.load(treeFile)
    return wordTree


def pickleTree(tree):
    'Serialize the word tree'
    with open("wordTree.pkl", "wb") as treeFile:
        cPickle.dump(tree, treeFile)


def checkIfWord(word, node, i=0):
    'Pass the word to check as word, and node as the root node of the word tree. Check if this set of letters can be traced through the tree and isWord of the last letter is true'
    if node.isWord and i == len(word):
	return True
    
    elif i < len(word) and word[i] in node:
	return checkIfWord(word, node[word[i]], i+1)

    else:
        return False


def getFromDatabase(sql):
    'General purpose function to execute a SELECT query on the database'
    try:
        database = MySQLdb.connect("localhost", "joe", "joesql", "boggle")
        database.autocommit(True)
        cursor = database.cursor()
        
        cursor.execute(sql)
        result = cursor.fetchall()
        
        cursor.close()
        database.close()
        
    except Exception as e:
        cursor.close()
        database.close()
        raise e
    
    else:
        return result


def sendToDatabase(sql):
    'General purpose function to execute an INSERT or UPDATE query on the database'
    try:
        database = MySQLdb.connect("localhost", "joe", "joesql", "boggle")
        database.autocommit(True)
        cursor = database.cursor()
        
        cursor.execute(sql)
        
        cursor.close()
        database.close()
        
    except Exception as e:
        cursor.close()
        database.close()
        raise e


def existsInDatabase(sql):
    'General purpose function to see if a SELECT query returns any results from the database'
    result = getFromDatabase(sql)
    
    if result:
        return True
    
    else:
        return False

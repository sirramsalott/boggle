#!/usr/bin/python
import MySQLdb, sys
sys.path.append("/var/www/cgi-bin")
from boggleGame import unPickleWordTree, getFromDatabase, sendToDatabase, existsInDatabase, checkIfWord
from wordTree import WordNode

'All classes and functions associated with a human user'

class User(object):
    'Super class for any user'

    def __init__(self, forename, surname, username):
        'Constructor for general user'
        self.forename = forename
        self.surname = surname
        self.username = username

    def insertCommand(self):
        'Create SQL command to insert this user to the database, using reflection'
        userType = self.__class__.__name__.lower()
        attrDict = self.__dict__
        sqlA = "INSERT INTO %s (" % userType
        sqlB = "VALUES ("

        for key in attrDict:
            if attrDict[key] is not None:
                sqlA += key + ", "
                
                if isinstance(attrDict[key], bool):
                    sqlB += "'" + str(attrDict[key]) + "',"

                elif isinstance(attrDict[key], int):
                    sqlB += str(attrDict[key]) + ", "

                
                else:
                    sqlB += "'" + attrDict[key] + "', "
        
        return sqlA[:-2] + ") " + sqlB[:-2] + ");"

    def save(self):
        'Insert this user into the database. Returns whether this was successful'
        successMessage = "Sign-up successful, please <a href='..'>log in</a>."

        sql = self.insertCommand()
        
        try:
            sendToDatabase(sql)

        except Exception as e:

            if e[0] == 1062: #error code for unique constraint violated
                successMessage = "A user already exists with that username. Please <a href='../pupilSignUp.html'>try again</a>."
            
            elif e[0] == 1452: #error code for referential integrity violated
                successMessage = "There is no teacher with that ID. Please <a href='../pupilSignUp.html'>try again</a>."
            
            else:
                successMessage = "Please contact system administrator with the below message: <br>" + str(e)
            
        return successMessage


    def __repr__(self):
        'Print the user in the command line'
        r = " i am a " + self.__class__.__name__
        attrDict = self.__dict__
        for key in attrDict:
            r += "\n my " + key + " is " + str(attrDict[key])
        return r


class Pupil(User):

    def __init__(self, username=None, forename=None, surname=None, pupilID = None):
        """Constructor for pupil. Pass pupilID or username explicitly when reading existing user from database.
        Otherwise pass all parameters explicitly if creating new pupil"""

        if username and forename and surname: #Create new Pupil from cgi.FieldStorage
            self.waitingForGame = False
            self.pupilID = pupilID #None, but added for integrity of objects
            super(Pupil, self).__init__(forename, surname, username)

        else: #Create Pupil from database
            if username: 
                sql = "SELECT pupilID FROM pupil WHERE username='%s';"%username
                
                if existsInDatabase(sql):
                    result = getFromDatabase(sql)[0][0]
                    self.pupilID = result
                    
                else:
                    raise Exception("User not found")

            else:
                if pupilID:
                    self.pupilID = pupilID

            result = getFromDatabase("""SELECT forename, surname, username, waitingForGame 
                                         FROM pupil WHERE pupilID=%d;"""%self.pupilID)
            if len(result) > 0:
                dbPupil = result[0]
                self.waitingForGame = dbPupil[3] == "True"
                super(Pupil, self).__init__(dbPupil[0], dbPupil[1], dbPupil[2])
            
            else:
                raise Exception("User not found")


    def generateTR(self):
        'Create HTML row for the pupil table on teacher homepage'
        tr = """<tr>
                  <td class="pupilID">%d</td>
                  <td class="pupilTD">%s</td>
                  <td class="pupilTD">%s</td>
                  <td class="pupilTD">%d</td>
                  <td class="pupilTD">
                    <input type="checkbox" class="pupilSelected" />
                  </td>
                  <td class="pupilTD">
                    <a href="viewPupil.py?pupilID=%d" target="_blank">View Pupil</a>
                  </td>
                </tr>"""%(self.pupilID, self.forename, self.surname, self.averageScore(), self.pupilID)
        return tr


    def findUnsubmittedPlayer(self):
        'Find any players with my pupilID who are unsubmitted'
        result = getFromDatabase("SELECT gameID FROM player WHERE pupilID=%d and submitted='False';"%self.pupilID)
        return result

    
    def isWaiting(self, waiting):
        'Update my isWaiting field in the database'
        sendToDatabase("UPDATE pupil SET waitingForGame='%s' WHERE pupilID=%d;"%(waiting, self.pupilID))


    def players(self):
        'Find all players with my pupilID'
        result = getFromDatabase("SELECT pupilID, gameID FROM player WHERE pupilID=%d;"%self.pupilID)
        playerList = [Player(row[0], row[1], True) for row in result]
        return playerList


    def averageScore(self):
        'Calculate my average score'
        score = 0
        players = self.players()
        i = 0

        if players:
            for player in players:
                if not players[i].score is None:
                    score += players[i].score
                    i += 1
            
            if i:
                score /= i
            
        return score


    def numOfGamesWon(self):
        'Calculate the number of games which I have won'
        sql = """SELECT player.gameID FROM player 
                 INNER JOIN(SELECT MAX(score) AS maxScore, gameID FROM player GROUP BY gameID) AS winner
                 ON player.gameID=winner.gameID AND winner.maxScore=player.score
                 WHERE player.pupilID=%d;"""%self.pupilID
        return len(getFromDatabase(sql))


    def pupilToHTML(self, teacherID=None):
        'Represent me as HTML for viewPupil and searchPupil pages'
        if not teacherID is None:
            element = "<a href='viewPupil.py?pupilID=%d'>Name: %s %s</a>"%(self.pupilID, self.forename, self.surname)
        
        else:
            element = "<p>Name: "+ self.forename + " " + self.surname + "</p>"

        element += "<p>Pupil ID: " + str(self.pupilID) + "</p>"
        element += "<p>Games Played: " + str(len(self.players())) + "</p>"
        element += "<p>Games won: " + str(self.numOfGamesWon()) + "</p>"
        element += "<p>Average Score: " + str(self.averageScore()) + "</p>"

        if not teacherID is None:
            element += "<table><tr><td><button value='adopt' onclick='adoptPupil({})'>Adopt</button></td><td id='adoptMsg'></td></tr></table>".format(self.pupilID)

        return element


class Teacher(User):

    def __init__(self, email=None, username=None, forename=None, surname=None, teacherID=None):
        """Constructor for teacher. Pass username explicitly if reading from database.
        If not, pass all parameters explicitly"""

        if email and username and forename and surname: #Create new Teacher from cgi.FieldStorage
            self.email = email
            self.teacherID = teacherID #None, but added for integrity of objects
            super(Teacher, self).__init__(forename, surname, username)

        else: #Create Teacher from databse
            
            if username:                    
                sql = "SELECT teacherID FROM teacher WHERE username='%s';"%username
                
                if existsInDatabase(sql):    
                    result = getFromDatabase(sql)[0][0]
                    self.teacherID = result

                else:
                    raise Exception("User not found")

            else:
                if teacherID:
                    self.teacherID = teacherID

            sql = """SELECT email, forename, surname, username
                     FROM teacher WHERE teacherID=%s;"""%self.teacherID
            if existsInDatabase(sql):
                result = getFromDatabase(sql)[0]
                self.email = result[0]
                super(Teacher, self).__init__(result[1], result[2], result[3])
                
            else:
                raise Exception("User not found")

class Player(object):
    "Player class - a 'join' between pupils and games"
    
    def __init__(self, pupilID, gameID, fromDatabase=False):
        """Constructor for Player.
        Pass value which evaluates to True if reading from database, otherwise pass pupilID and gameID only"""

        self.pupilID = pupilID
        self.gameID = gameID

        if fromDatabase:
            result = getFromDatabase("SELECT submitted, score FROM player WHERE pupilID=%d AND gameID=%d;"%(pupilID, gameID))[0]
            self.submitted = result[0]
            self.score = result[1]

        else:
            self.submitted = False
            self.score = None


    def __repr__(self):
        'Print Player in the command line'
        return "pupilID: %d\n gameID: %d\n submitted: %s\nscore: %s"%(self.pupilID, self.gameID, self.submitted, str(self.score))


    def save(self):
        'Insert player to the database'
        sql = "INSERT INTO player (pupilID, gameID, submitted) VALUES (%d, %d, '%s');"%(self.pupilID,
                                                                                        self.gameID,
                                                                                        str(self.submitted))
        sendToDatabase(sql)


    def submit(self, playerWords):
        'Insert all words in playerWords to the table playerWord'

	wordTree = unPickleWordTree()
        database = MySQLdb.connect("localhost", "joe", "joesql", "boggle")
        #sendToDatabase not used so that LAST_INSERT_ID can run

        database.autocommit(True)
        cursor = database.cursor()
        
        for word in playerWords:
            sql = """SELECT word.wordID FROM word INNER JOIN boardWord ON word.wordID=boardWord.wordID
                     WHERE word.word='%s' AND boardWord.gameID=%d;"""%(word, self.gameID)
            cursor.execute(sql)
            result = cursor.fetchone()
            
            if not result is None: #word is a real word and exists in this game
                wordID = result[0]
                legitimate = "True"

            else: #word does not exist in this game, but is not necessarily illegitimate
                sql = "SELECT wordID FROM word WHERE word='%s';"%word
                cursor.execute(sql)
                result = cursor.fetchone()
                
                if not result is None: #word exists in 'word' table - whether or not it is legitimate is irrelevant
                    wordID = result[0]

                else: #word needs to be inserted into word table before proceeding
                    cursor.execute("INSERT INTO word (word, isWord) VALUES ('%s', '%s');"%(word, str(checkIfWord(word, wordTree))))
                    cursor.execute("SELECT LAST_INSERT_ID();")
                    wordID = cursor.fetchone()[0]
                
                legitimate = "False"
            
            sql = "INSERT INTO playerWord VALUES (%d, %d, %d, '%s');"%(self.pupilID, self.gameID, wordID, legitimate)
            try:
                cursor.execute(sql)

            except Exception as e:
                if e[0] == 1062: #Non-unique primary key. User has entered the same word twice
                    pass

                else:
                    raise e

        cursor.execute("UPDATE player SET submitted='True' WHERE pupilID=%d and gameID=%d;"%(self.pupilID, self.gameID))

        cursor.close()
        database.close()

    
    def otherPlayersWords(self):
        'Return all legitimate words found by other players, including ones which I also found'
        otherWords = getFromDatabase("""SELECT word.word FROM word INNER JOIN playerWord on playerWord.wordID=word.wordID
                                        WHERE playerWord.gameID=%d AND playerWord.pupilID!=%d
                                        AND playerWord.legitimate='True';"""%(self.gameID, self.pupilID))
        return [item[0] for item in otherWords]


    def allWords(self):
        'Return all the words which I found'
        wordList = getFromDatabase("""SELECT word.word, playerWord.legitimate FROM word INNER JOIN playerWord
                                    ON word.wordID=playerWord.wordID WHERE playerWord.pupilID=%d
                                    AND playerWord.gameID=%d ORDER BY word.word;"""%(self.pupilID, self.gameID))
        return wordList


    def wordTable(self):
        'Convert all my words into HTML table'
        wordList = getFromDatabase("""SELECT word.word, playerWord.legitimate FROM word INNER JOIN playerWord
                                      ON playerWord.wordID = word.wordID WHERE playerWord.pupilID=%d
                                      AND playerWord.gameID=%d ORDER BY word.word;"""%(self.pupilID, self.gameID))
        myWords = self.allWords()
        otherWords = self.otherPlayersWords()

        table = "<table class='wordList'>"
        for i in range(len(wordList)):
            if i % 2 == 0:
                table += "<tr>"

            score = self.wordScore(wordList[i], wordList, otherWords)
            table += "<td class='wordCell" + (" onlyMine" if wordList[i][0] not in otherWords else "") + "'>" + wordList[i][0] + "</td>"
            table += "<td class='wordCell'>%d</td>"%score

            if i % 2 == 1 or i == len(wordList) - 1:
                table += "</tr>"

        table += "</table>"
        return table


    def wordScore(self, wordRow, myWords, otherWords):
        'Score a word based on its length ("qu" only counts as one letter) and whether it is unique to me'
        if wordRow[1] == "True" and not (wordRow[0] + 's', "True") in myWords:
            word = wordRow[0]
            return len(word) - 1 \
                             - ('q' in word) \
                             - (word in otherWords or \
                                word + "s" in otherWords or \
                                (word[-1] == "s" and \
                                 word[:-1] in otherWords))
        else:
            return 0


    def scoreGame(self):
        'Calculate my score and update it in the database'
        myWords = self.allWords()
        otherWords = self.otherPlayersWords()
        score = 0
        
        for wordRow in myWords:
            score += self.wordScore(wordRow, myWords, otherWords)
            
        sendToDatabase("UPDATE player SET score=%d WHERE pupilID=%d AND gameID=%d;"%(score, self.pupilID, self.gameID))


    def pupilToHTML(self, teacherID=None):
        'Represent player on the viewGame page'

        pupil = Pupil(pupilID = self.pupilID)
        
        if not teacherID is None:
            element = "<a href='viewPupil.py?pupilID=%d'><h6>%s %s</h6></a>"%(self.pupilID, pupil.forename, pupil.surname)
        
        else:
            element = "<h6 style='color: white;'>%s %s</h6>"%(pupil.forename, pupil.surname)
        
        element += """<p>Score: %s</p>
                 <p>Words: </p>"""%(lambda s: "N/A" if s is None else str(s))(self.score)
        
        element += self.wordTable()
        element += "</td>"
        return element

    
    def gameToHTML(self, teacherID=None):
        'Represent player on the viewPupil game'
        dateStarted = getFromDatabase("SELECT dateStarted FROM game WHERE gameID=%d;"%self.gameID)[0]

        if not teacherID is None:
            element = "<a href=viewGame.py?gameID=%d><h6>Game %d</h6></a>"%(self.gameID, self.gameID)
        
        else:
            element = "<h6>Game %d</6>"%self.gameID

        element += "<p>Date: %s</p>"%dateStarted
        element += """<p>Score: %s</p>
                 <p>Words: </p>"""%(lambda s: "N/A" if s is None else str(s))(self.score)
        element += self.wordTable()
        element += "</td>"

        return element


def teacherMenuBar():
    "HTML for the teacher's menu bar, which allows them to search for pupils and games"
    return """<!--jQuery is sometimes not loaded in the orginal page-->
              <script src='../scripts/jquery.js'></script>
              <script src='../scripts/validate.js'></script>
              <script src='../scripts/teacherMenuBar.js'></script>
              <link rel="stylesheet" type="text/css" href="../styles/teacherMenuBar.css">

              <table style="width:100%;">
                <tr>
                  <td class='teacherMenuCell'>
                      <a href='teacherHomepage.py' id="homeCell">
                        Home
                      </a>
                  </td>
                  <td class='teacherMenuCell'>
                    Search For Pupil:
                    <form method='get' name='searchPupil' action='viewPupil.py'>
                      <input type='text' name='pupilSearchData'>
                      Search By:
                      <select name='pupilDataType'>
                        <option value='pupilID' selected>Pupil ID</option><!--DEFAULT VALUE-->
                        <option value='forename'>Forename</option>
                        <option value='surname'>Surname</option>
                      </select>
                      <input type='submit' value='Submit'>
                    </form>
                  </td>
                  <td class='teacherMenuCell'>
                    Search For Game:
                    <form method='get' name='searchGame' action='viewGame.py'>
                      <input type='text' name='gameSearchData'>
		      <span id="dateInstruction">(Please enter dates in the format YYYY-MM-DD)</span><br>
                      Search By:
                      <select name='gameDataType'>
                        <option value='date'>Date</option> 
                        <option value='gameID' selected>Game ID</option><!--DEFAULT VALUE-->
                        </select>
                      <input type='submit' value='Submit'>
                    </form>
                 </td>
              </tr>
            </table>"""


def errorPage():
    'HTML page to report exceptions to the user'
    return  """Content-type: text/html

<html>

  <head>

    <title>An error occurred</title>
    <link rel="stylesheet" type="text/css" href="../styles/boggleStyles.css">

  </head>

  <body>
    
    <div id="pageContainer">

      <a href="..">
        <img id="boggleLogo" src="../images/boggleLogo.png">
      </a>      

      %s <!--TEACHER MENU BAR-->

      <div class="centreForegroundWide">

        <h3>
          An error occurred. If the following message is unexpected, please contact system administrator or your teacher.
        </h3>

        <p id='errorMessage'>
          %s
        </p>

        <h3>
          If the option to go home is not available, please try going back or <a href="..">log in</a> again.
        </h3>

      </div>

    </div>

  </body>

</html>"""

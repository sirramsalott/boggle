import unittest, warnings, MySQLdb
from boggleUser import Pupil
from BoggleDB import BoggleDBCursor

class TestPupil(unittest.TestCase):
    def _ensurePlayerDoesNotExist(self, pupilID, gameID=None):
        with BoggleDBCursor() as cur:
            if gameID:
                cur.execute("DELETE FROM player " \
                            "WHERE pupilID = %s AND gameID = %s;",
                            (pupilID, gameID))
            else:
                cur.execute("DELETE FROM player " \
                            "WHERE pupilID = %s;", (pupilID,))        

    def _ensureGameExists(self, gameID, date, board):
        with BoggleDBCursor() as cur:
            cur.execute("INSERT IGNORE INTO game " \
                        "  (gameID, dateStarted, board) " \
                        "VALUES " \
                        "  (%s, %s, %s);", (gameID, date, board))

    def _ensurePlayerExists(self, pupilID, gameID, submitted):
        with BoggleDBCursor() as cur:
            cur.execute("INSERT IGNORE INTO player " \
                        "  (pupilID, gameID, submitted)" \
                        "VALUES (%s, %s, %s);",
                        (pupilID, gameID, submitted))

    def test_getWaitingGame_noGameIsFalsy(self):
        self._ensurePlayerDoesNotExist(pupilID=1)
        g = Pupil.getWaitingGame(pupilID=1)
        self.assertFalse(g)

    def test_getWaitingGame_gameExists(self):
        self._ensureGameExists(gameID=1, date='2020-04-14',
                               board='rirehgaoesoldivs')
        self._ensurePlayerExists(gameID=1, pupilID=1, submitted="False")
        g = Pupil.getWaitingGame(pupilID=1)
        self.assertEqual(g, {"gameID": 1, "board": "rirehgaoesoldivs"})
        self._ensurePlayerDoesNotExist(1, 1)

    def test_markAsWaiting(self):
        Pupil.markAsWaiting(1, True)

        with BoggleDBCursor() as cur:
            cur.execute("SELECT waitingForGame FROM pupil " \
                        "WHERE pupilID=1;")
            res = cur.fetchone()
        self.assertEqual(res[0], "True")

        Pupil.markAsWaiting(1, False)

        with BoggleDBCursor() as cur:
            cur.execute("SELECT waitingForGame FROM pupil " \
                        "WHERE pupilID=1;")
            res = cur.fetchone()
        self.assertEqual(res[0], "False")


if __name__ == '__main__':
    warnings.filterwarnings("ignore", category=MySQLdb.Warning)
    unittest.main()

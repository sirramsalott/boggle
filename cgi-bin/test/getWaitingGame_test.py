import unittest
from mock import MagicMock
from getWaitingGame import response
from boggleUser import Pupil

class TestGetWaitingGame(unittest.TestCase):
    def test_getWaitingGame_printsFoundFalseIfNoGame(self):
        Pupil.getWaitingGame = MagicMock(return_value=None)
        self.assertEqual(response(pupilID=1),
                         """Status: 200 OK
Content-Type: application/json
Content-Length: 16

{"found": false}""")

    def test_getWaitingGame_gameFound(self):
        Pupil.getWaitingGame = MagicMock(return_value={"gameID": 1,
                                                       "board": "bcde"})
        self.assertEqual(response(1),
                         """Status: 200 OK
Content-Type: application/json
Content-Length: 45

{"found": true, "gameID": 1, "board": "bcde"}""")

if __name__ == '__main__':
    unittest.main()

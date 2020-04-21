import unittest
from mock import MagicMock
from scoreboard import response
from boggleGame import Game

class TestScoreboard(unittest.TestCase):
    def test_scoreboard_notScored(self):
        Game.__init__ = MagicMock(return_value=None)
        Game.allPlayersScored = MagicMock(return_value=False)
        self.assertEqual(response(1),
"""Status: 200 OK
Content-Type: application/json
Content-Length: 20

{"available": false}""")

    def test_scoreboard_available(self):
        Game.__init__ = MagicMock(return_value=None)
        Game.allPlayersScored = MagicMock(return_value=True)
        self.assertEqual(response(1),
"""Status: 200 OK
Content-Type: application/json
Content-Length: 19

{"available": true}""")

if __name__ == '__main__':
    unittest.main()

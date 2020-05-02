import unittest
from mock import MagicMock
from allPlayersSubmitted import response
from boggleGame import Game

class TestAllPlayersSubmitted(unittest.TestCase):
    def test_allPlayersSubmitted_notSubmitted(self):
        Game.__init__ = MagicMock(return_value=None)
        Game.allPlayersSubmitted = MagicMock(return_value=False)
        self.assertEqual(response(1),
"""Status: 200 OK
Content-Type: application/json
Content-Length: 20

{"submitted": false}""")

    def test_allPlayersSubmitted_notSubmitted(self):
        Game.__init__ = MagicMock(return_value=None)
        Game.allPlayersSubmitted = MagicMock(return_value=True)
        self.assertEqual(response(1),
"""Status: 200 OK
Content-Type: application/json
Content-Length: 19

{"submitted": true}""")

    def test_absentPlayersMarked(self):
        Game.markAbsentPlayersSubmitted = MagicMock()
        response(1)
        self.assertTrue(Game.markAbsentPlayersSubmitted.called)

if __name__ == '__main__':
    unittest.main()

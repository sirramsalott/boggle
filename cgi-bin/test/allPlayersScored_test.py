import unittest
from mock import MagicMock
from allPlayersScored import response
from boggleGame import Game

class TestAllPlayersScored(unittest.TestCase):
    def test_allPlayersScored_notScored(self):
        Game.__init__ = MagicMock(return_value=None)
        Game.allPlayersScored = MagicMock(return_value=False)
        self.assertEqual(response(1),
"""Status: 200 OK
Content-Type: application/json
Content-Length: 16

{"scored": false}""")

    def test_allPlayersScored_notScored(self):
        Game.__init__ = MagicMock(return_value=None)
        Game.allPlayersScored = MagicMock(return_value=True)
        self.assertEqual(response(1),
"""Status: 200 OK
Content-Type: application/json
Content-Length: 16

{"scored": true}""")

if __name__ == '__main__':
    unittest.main()

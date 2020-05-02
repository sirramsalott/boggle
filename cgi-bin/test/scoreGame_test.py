import unittest
from mock import MagicMock
from scoreGame import response
from boggleUser import Player

class TestScoreGame(unittest.TestCase):
    def test_scoreGame_responseForSuccess(self):
        Player.__init__ = MagicMock(return_value=None)
        Player.scoreGame = MagicMock()
        self.assertEqual(response(1, 1),
"""Status: 200 OK
Content-Type: application/json
Content-Length: 14

{"done": true}""")
        
if __name__ == '__main__':
    unittest.main()


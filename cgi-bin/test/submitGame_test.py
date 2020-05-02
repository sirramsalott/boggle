import unittest
from mock import MagicMock
from submitGame import response
from boggleUser import Player

class TestSubmitGame(unittest.TestCase):
    def test_submitGame_MemoryErrorMeansDoneIsFalse(self):
        Player.__init__ = MagicMock(return_value=None)
        Player.submit = MagicMock(side_effect=MemoryError())
        self.assertEqual(response(1, 1, "t"),
"""Status: 200 OK
Content-Type: application/json
Content-Length: 15

{"done": false}""")

    def test_submitGame_responseForSuccess(self):
        Player.__init__ = MagicMock(return_value=None)
        Player.submit = MagicMock(side_effect=None)
        self.assertEqual(response(1, 1, "t"),
"""Status: 200 OK
Content-Type: application/json
Content-Length: 14

{"done": true}""")

        
if __name__ == '__main__':
    unittest.main()


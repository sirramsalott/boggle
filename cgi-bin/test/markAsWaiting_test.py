import unittest
from mock import MagicMock
from markAsWaiting import response
from boggleUser import Pupil

class TestMarkAsWaiting(unittest.TestCase):
    def test_markAsWaiting_response(self):
        Pupil.markAsWaiting = MagicMock(return_value=None)
        self.assertEqual(response(pupilID=1),
                         """Status: 200 OK
Content-Type: application/json
Content-Length: 14

{"done": true}""")

if __name__ == '__main__':
    unittest.main()


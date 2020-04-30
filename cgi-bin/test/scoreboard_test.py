import unittest
from mock import MagicMock, patch
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


    @patch('scoreboard.Game')
    @patch('scoreboard.Player')
    @patch('scoreboard.Pupil')
    def test_scoreboard_available(self, mockPupilCtr, mockPlayerCtr,
                                  mockGameCtr):
        mockGame = mockGameCtr.return_value
        mockGame.allPlayersScored.return_value = True
        mockGame.dateStarted = "25-12-0000"
        mockGame.possibleWords.return_value = ["cake", "each", "mine",
                                               "dogs", "cakes", "dog"]
        mockGame.players.return_value = [1, 2, 3]

        mockPlayer = mockPlayerCtr.return_value
        mockPlayer.allWords.side_effect = [[("cakes", True),
                                            ("cake", True),
                                            ("dog", True)],
                                           [("cake", True),
                                            ("each", True),
                                            ("take", True)],
                                           [("ceak", False),
                                            ("dogs", True)]]
        mockPlayer.otherPlayersWords.side_effect = [["cake", "each",
                                                     "take", "ceak",
                                                     "dogs"],
                                                    ["cakes", "cake",
                                                     "dog", "ceak",
                                                     "dogs"],
                                                    ["cakes", "cake",
                                                     "dog", "cake",
                                                     "each", "take"]]
        mockPlayer.score = 1
        mockPlayer.wordScore.return_value = 1

        mockPupil = mockPupilCtr.return_value
        mockPupil.forename = "pup"
        mockPupil.surname = "pup"

        self.assertEqual(response(1),
"""Status: 200 OK
Content-Type: application/json
Content-Length: 771

{"available": true, "players": [{"score": 1, "name": "pup pup", "words": [{"unique": true, "word": "cakes", "score": 1, "legit": true}, {"unique": false, "word": "cake", "score": 1, "legit": true}, {"unique": true, "word": "dog", "score": 1, "legit": true}]}, {"score": 1, "name": "pup pup", "words": [{"unique": false, "word": "cake", "score": 1, "legit": true}, {"unique": true, "word": "each", "score": 1, "legit": true}, {"unique": true, "word": "take", "score": 1, "legit": false}]}, {"score": 1, "name": "pup pup", "words": [{"unique": true, "word": "ceak", "score": 1, "legit": false}, {"unique": true, "word": "dogs", "score": 1, "legit": true}]}], "gameID": 1, "board": "", "date": "25-12-0000", "possibleWords": ["cake", "each", "mine", "dogs", "cakes", "dog"]}""")

if __name__ == '__main__':
    unittest.main()

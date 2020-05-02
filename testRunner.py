import unittest, sys, os, warnings, MySQLdb
sys.path.append(os.path.join(os.path.dirname(os.path.realpath(__file__)), "cgi-bin", "test"))
import bogglePupil_test
import getWaitingGame_test
import markAsWaiting_test
import submitGame_test
import allPlayersSubmitted_test
import scoreGame_test
import scoreboard_test

loader = unittest.TestLoader()
suite  = unittest.TestSuite()

suite.addTests(loader.loadTestsFromModule(bogglePupil_test))
suite.addTests(loader.loadTestsFromModule(getWaitingGame_test))
suite.addTests(loader.loadTestsFromModule(markAsWaiting_test))
suite.addTests(loader.loadTestsFromModule(submitGame_test))
suite.addTests(loader.loadTestsFromModule(allPlayersSubmitted_test))
suite.addTests(loader.loadTestsFromModule(scoreGame_test))
suite.addTests(loader.loadTestsFromModule(scoreboard_test))

runner = unittest.TextTestRunner()
warnings.filterwarnings("ignore", category=MySQLdb.Warning)
runner.run(suite)

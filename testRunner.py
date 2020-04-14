import unittest, sys, os
sys.path.append(os.path.join(os.path.dirname(os.path.realpath(__file__)), "cgi-bin", "test"))
import bogglePupil_test
import getWaitingGame_test
import markAsWaiting_test

loader = unittest.TestLoader()
suite  = unittest.TestSuite()

suite.addTests(loader.loadTestsFromModule(bogglePupil_test))
suite.addTests(loader.loadTestsFromModule(getWaitingGame_test))
suite.addTests(loader.loadTestsFromModule(markAsWaiting_test))

runner = unittest.TextTestRunner()
runner.run(suite)

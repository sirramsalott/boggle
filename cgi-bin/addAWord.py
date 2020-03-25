#!/usr/bin/python
import cgi, sys
sys.path.append("/var/www/cgi-bin")
import wordTree
from boggleGame import unPickleWordTree, pickleTree, extendTree

post = cgi.FieldStorage()
newWord = post["word"].value

try:
    tree = unPickleWordTree()
    extendTree(tree, newWord)
    pickleTree(tree)
    print "'%s' added to the lexicon."%newWord
    
except Exception as e:
    print str(e)

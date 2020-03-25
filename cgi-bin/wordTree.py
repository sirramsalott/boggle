#!/usr/bin/python
"""Must exist in a separate file from pickling and unpickling functions
   The word tree represents the lexicon more efficiently than a simple list
   For a simple lexicon of [bar, barn, bat], it can be represented as follows (* indicates that isWord is True):

                   /-> R* -> N*
   START -> B -> A
                   \-> T*
"""

class WordNode(dict):
    'Dictionary with flag to indicate that this node is at the end of a word'
    isWord = False

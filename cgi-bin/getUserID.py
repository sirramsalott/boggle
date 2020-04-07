#!/usr/bin/python
import cgi, sys, MySQLdb


def checkUserExists(username, userType):
    try:
        database = MySQLdb.connect("localhost", "joe", "joesql", "boggle")
        database.autocommit(True)
        cursor = database.cursor()
        cursor.execute("SELECT {0}ID FROM {0} WHERE username=%s;".format(userType.lower()), (username,))
        userID = cursor.fetchall()
        cursor.close()
        database.close()
    except Exception as e:
        cursor.close()
        database.close()
        raise e
    else:
        if userID:
            return userID[0][0]


if __name__ == '__main__':
    try:
        post = cgi.FieldStorage()
        print("Content-Type: text/html\n")
        print(checkUserExists(username=post["username"].value,
                              userType=post["userType"].value))
    except Exception as e:
        print(str(e))

              

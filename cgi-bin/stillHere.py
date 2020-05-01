import cgi, time
from BoggleDB import BoggleDBCursor

if __name__ == "__main__":
    pupilID = cgi.FieldStorage()["pupilID"].value
    with BoggleDBCursor() as cur:
        cur.execute("UPDATE pupil SET lastSeen = %s WHERE pupilID = %s",
                    (time.time(), pupilID))

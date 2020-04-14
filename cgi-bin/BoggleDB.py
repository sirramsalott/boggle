import MySQLdb, contextlib

@contextlib.contextmanager
def BoggleDBConn():
    conn = MySQLdb.connect("localhost", "joe", "joesql", "boggle")

    try:
        yield conn
    except Exception:
        conn.rollback()
        raise
    else:
        conn.commit()
    finally:
        conn.close()

@contextlib.contextmanager
def BoggleDBCursor():
    with BoggleDBConn() as conn:
        cur = conn.cursor()
        try:
            yield cur
        finally:
            cur.close()

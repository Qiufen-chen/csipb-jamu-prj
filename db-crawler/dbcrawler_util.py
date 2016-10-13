# util.py
import MySQLdb

def mysqlCommit(db, cursor, query):
    try:
        cursor.execute(query)
        db.commit()

        return cursor.fetchone()
    except (MySQLdb.Error, MySQLdb.Warning) as e:
        db.rollback()
        assert False, 'mySQL Error: '+str(e)

def mysqlExist(db,cursor,table,where):
    q = 'SELECT * FROM '+table+' WHERE ' + where
    exist = mysqlCommit(db, cursor,q)

    return (exist!=None)

from app.db.database import connection
import psycopg2.extras

class Model():
    conn    = None
    cursor  = None
    table   = None
    result  = []
 
    def __init__(self, model_shape = None):
        self.conn = connection()
        self.cursor = self.conn.cursor(cursor_factory = psycopg2.extras.DictCursor)
        if model_shape:
            for attribute in model_shape:
                setattr(self, attribute, model_shape[attribute])
    
    def getAll(self):
        query = f'SELECT * FROM public."{self.table}" ORDER BY id ASC'
        self.cursor.execute(query)
        response = self.cursor.fetchall()
        if len(response):
            self.result = response
        else:
            self.result = None
        return self.fetch()

    def first(self, user_id: int):
        query = f'SELECT * FROM public."{self.table}" WHERE id = %s'
        self.cursor.execute(query, (user_id,))
        response = self.cursor.fetchone()
        if response:
            self.result = response
        return self.fetch(True)

    def query(self, sql):
        self.cursor.execute(sql)
        return self.cursor.fetchall()

    def fetch(self, single = False):
        if self.result and not single:
            return [dict(record) for record in self.result]
        elif self.result and single:
            return dict(self.result)
        return None
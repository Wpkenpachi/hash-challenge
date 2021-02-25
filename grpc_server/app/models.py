from .database import connection
import psycopg2.extras

class BaseModel():
    conn    = None
    cursor  = None
    table   = None
    result  = []
 
    def __init__(self, my_dict = None):
        self.conn = connection
        self.cursor = self.conn.cursor(cursor_factory = psycopg2.extras.DictCursor)
        if my_dict:
            for key in my_dict:
                setattr(self, key, my_dict[key])
    
    def getAll(self):
        query = f"SELECT * FROM public.{self.table} ORDER BY id ASC"
        self.cursor.execute(query)
        response = self.cursor.fetchall()
        if len(response):
            self.result = response
        else:
            self.result = None
        return self.fetch()

    def first(self, user_id: int):
        query = f"SELECT * FROM public.{self.table} WHERE id = {user_id} ORDER BY id ASC"
        self.cursor.execute(query)
        response = self.cursor.fetchone()
        if len(response):
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

class User(BaseModel):
    id = None
    first_name = None
    last_name = None
    date_of_birth = None

    def __init__(self, my_dict = None):
        super().__init__(my_dict)
        self.table = "user"

class Product(BaseModel):
    id = None
    price_in_cents = None
    title = None
    description = None

    def __init__(self, my_dict = None):
        super().__init__(my_dict)
        self.table = "product"

class Discount(BaseModel):
    id = None
    title = None
    metadata = None

    def __init__(self, my_dict = None):
        super().__init__(my_dict)
        self.table = "discount"
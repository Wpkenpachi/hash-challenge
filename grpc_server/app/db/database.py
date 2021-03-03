import os
from peewee import *
from dotenv import load_dotenv
load_dotenv()

def connection():
    return PostgresqlDatabase(os.getenv('POSTGRES_DB'), **{'host': os.getenv('POSTGRES_HOST'), 'port': os.getenv('POSTGRES_PORT'), 'user': os.getenv('POSTGRES_USER'), 'password': os.getenv('POSTGRES_PASSWORD')})

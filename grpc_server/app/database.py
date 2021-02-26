import psycopg2
import os, time
from dotenv import load_dotenv

print("DB_CONNECTION: ")
print(os.getenv("POSTGRES_HOST"), int(os.getenv("POSTGRES_PORT")), os.getenv("POSTGRES_DB"), os.getenv("POSTGRES_USER"), os.getenv("POSTGRES_PASSWORD"))

def connection():
    return psycopg2.connect(
        host=os.getenv('POSTGRES_HOST'),
        port=os.getenv('POSTGRES_PORT'),
        database=os.getenv('POSTGRES_DB'),
        user=os.getenv('POSTGRES_USER'),
        password=os.getenv('POSTGRES_PASSWORD')
    )
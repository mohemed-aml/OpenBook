import sqlite3
import psycopg2
import yaml

from db_server_connect import insert_textbooks, insert_chapters, insert_qa, insert_bp, insert_fb

with open('creds.yaml', 'r') as f:
    yaml_data = yaml.load(f, Loader=yaml.SafeLoader)
    postgres_data = yaml_data.get('postgres', {})

db_params = {
    'host': 'localhost',
    'port': '5432',
    'dbname': 'book',
    'user': postgres_data.get('username'),
    'password': postgres_data.get('password'),
}

sqlite_conn = sqlite3.connect('raw_data/book.db')
sqlite_cur = sqlite_conn.cursor()

#Migrates all the sql data from the local sqlite3 database to the postgreSQL database server
if __name__ == "__main__":
    # insert_textbooks()
    insert_chapters()
    insert_qa()
    insert_bp()
    insert_fb()
    sqlite_cur.close()
    sqlite_conn.close()

import sqlite3
import psycopg2
import yaml

with open('creds.yaml', 'r') as f:
    yaml_data = yaml.load(f, Loader=yaml.SafeLoader)
    postgres_data = yaml_data.get('postgres_db', {})

db_params = {
    'host': 'localhost',
    'port': '5432',
    'dbname': 'book',
    'user': postgres_data.get('username'),
    'password': postgres_data.get('password'),
}

sqlite_conn = sqlite3.connect('raw_data/book.db')
sqlite_cur = sqlite_conn.cursor()

############################################### Migration code #########################################################
def insert_textbooks():
    sqlite_cur.execute("SELECT * FROM textbooks;")
    data = sqlite_cur.fetchall()
    try:
        pg_conn = psycopg2.connect(**db_params)
        pg_cur = pg_conn.cursor()
    
        for row in data:
            # print("INSERT INTO textbooks (book_title) VALUES ('%s');"% row[1])
            pg_cur.execute("INSERT INTO textbooks (textbook_id, book_title) VALUES (%s, '%s');"% row)

        pg_conn.commit()
        print(f"The textbook table has been migrated successfully!")

    except (Exception, psycopg2.DatabaseError) as error:
        print(f"The error you are getting id : {error}")
        if pg_conn is not None:
            pg_conn.rollback()
            
    finally:
        if pg_cur is not None:
            pg_cur.close()
        if pg_conn is not None:
            pg_conn.close()
            
 
           
def insert_chapters():
    sqlite_cur.execute("SELECT * FROM chapters;")
    data = sqlite_cur.fetchall()
    try:
        pg_conn = psycopg2.connect(**db_params)
        pg_cur = pg_conn.cursor()
    
        for row in data:
            pg_cur.execute("INSERT INTO chapters (chapter_id, textbook_id, chapter_title) VALUES (%s, %s, '%s');"% row) 
        pg_conn.commit()
        print(f"The chapters table has been migrated successfully!")

    except (Exception, psycopg2.DatabaseError) as error:
        print(f"The error you are getting id : {error}")
        if pg_conn is not None:
            pg_conn.rollback()
            
    finally:
        if pg_cur is not None:
            pg_cur.close()
        if pg_conn is not None:
            pg_conn.close()



def insert_qa():
    sqlite_cur.execute("SELECT * FROM question_answers;")
    data = sqlite_cur.fetchall()
    try:
        pg_conn = psycopg2.connect(**db_params)
        pg_cur = pg_conn.cursor()
    
        for row in data:
            pg_cur.execute("""
                           INSERT INTO question_answers (question_id, chapter_id, question, answer) VALUES (%s, %s, '%s', '%s');
                           """% row)
        pg_conn.commit()
        print(f"The chapters table has been migrated successfully!")

    except (Exception, psycopg2.DatabaseError) as error:
        print(f"The error you are getting id : {error}")
        if pg_conn is not None:
            pg_conn.rollback()
            
    finally:
        if pg_cur is not None:
            pg_cur.close()
        if pg_conn is not None:
            pg_conn.close()
            
            
            
def insert_bp():
    sqlite_cur.execute("SELECT * FROM bulletpoints;")
    data = sqlite_cur.fetchall()
    try:
        pg_conn = psycopg2.connect(**db_params)
        pg_cur = pg_conn.cursor()
    
        for row in data:
            pg_cur.execute("""
                           INSERT INTO bulletpoints (bp_id, chapter_id, bullet_point) VALUES (%s, %s, '%s');
                           """% row) 
        pg_conn.commit()
        print(f"The chapters table has been migrated successfully!")

    except (Exception, psycopg2.DatabaseError) as error:
        print(f"The error you are getting id : {error}")
        if pg_conn is not None:
            pg_conn.rollback()
            
    finally:
        if pg_cur is not None:
            pg_cur.close()
        if pg_conn is not None:
            pg_conn.close()



def insert_fb():
    sqlite_cur.execute("SELECT * FROM fillintheblanks;")
    data = sqlite_cur.fetchall()
    try:
        pg_conn = psycopg2.connect(**db_params)
        pg_cur = pg_conn.cursor()
    
        for row in data:
            pg_cur.execute("""
                           INSERT INTO fillintheblanks (fb_id, chapter_id, fb_question, fb_answer) VALUES (%s, %s, '%s', '%s');
                           """% row) 
        pg_conn.commit()
        print(f"The chapters table has been migrated successfully!")

    except (Exception, psycopg2.DatabaseError) as error:
        print(f"The error you are getting id : {error}")
        if pg_conn is not None:
            pg_conn.rollback()
            
    finally:
        if pg_cur is not None:
            pg_cur.close()
        if pg_conn is not None:
            pg_conn.close()




            
            


            
            



        
        













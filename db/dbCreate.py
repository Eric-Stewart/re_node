import sqlite3

# Function to execute SQL script
def execute_script(cursor, script):
    try:
        cursor.executescript(script)
        print("Script executed successfully.")
    except sqlite3.Error as e:
        print("Error executing script:", e)

# Connect to SQLite database (creates if not exists)
conn = sqlite3.connect('reinsurance.db')
cursor = conn.cursor()

# SQL script
sql_table = open("re_table.sql", "r")
sql_table_script = sql_table.read()
sql_table.close()
sql_insert = open("re_insert.sql", "r")
sql_insert_script = sql_insert.read()
sql_insert.close()

# Execute SQL script
execute_script(cursor, sql_table_script)
execute_script(cursor, sql_insert_script)

# Commit changes and close connection
conn.commit()
conn.close()

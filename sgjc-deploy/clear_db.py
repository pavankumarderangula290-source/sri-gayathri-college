import sqlite3

def clear_db():
    conn = sqlite3.connect('database.sqlite')
    cursor = conn.cursor()
    
    # Get all tables
    cursor.execute("SELECT name FROM sqlite_master WHERE type='table';")
    tables = cursor.fetchall()
    
    for table_name in tables:
        table = table_name[0]
        # We don't want to clear the admin table, or maybe we do? 
        # The user said "clear all data in database". 
        # If I clear admin table, how will the user login?
        # Let's check admin table.
        if table != "admin" and table != "sqlite_sequence":
            print(f"Clearing table: {table}")
            cursor.execute(f"DELETE FROM {table};")
            
    conn.commit()
    conn.close()
    print("Database cleared, preserved admin credentials.")

if __name__ == '__main__':
    clear_db()

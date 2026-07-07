import sqlite3
from werkzeug.security import generate_password_hash, check_password_hash

DB_NAME = "homework.db"

def get_db_connection():
    conn = sqlite3.connect(DB_NAME, check_same_thread=False)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_db_connection()
    conn.execute('CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT UNIQUE NOT NULL, password_hash TEXT NOT NULL)')
    conn.execute('CREATE TABLE IF NOT EXISTS chat_history (id INTEGER PRIMARY KEY AUTOINCREMENT, user_id TEXT, sender TEXT, message TEXT)')
    # FIXED: Added user_id to separate schedules between accounts
    conn.execute('CREATE TABLE IF NOT EXISTS schedule (id INTEGER PRIMARY KEY AUTOINCREMENT, user_id TEXT, subject TEXT, topic TEXT, task TEXT, time TEXT)')
    conn.commit()
    conn.close()

def register_user(username, password):
    conn = get_db_connection()
    try:
        conn.execute('INSERT INTO users (username, password_hash) VALUES (?, ?)', (username, generate_password_hash(password)))
        conn.commit()
        return True
    except sqlite3.IntegrityError:
        return False
    finally:
        conn.close()

def verify_user(username, password):
    conn = get_db_connection()
    user = conn.execute('SELECT id, password_hash FROM users WHERE username = ?', (username,)).fetchone()
    conn.close()
    if user and check_password_hash(user['password_hash'], password):
        return user['id']
    return None

def get_user_by_id(user_id):
    conn = get_db_connection()
    user = conn.execute('SELECT id, username FROM users WHERE id = ?', (user_id,)).fetchone()
    conn.close()
    return user

def add_chat_message(user_id, sender, message):
    conn = get_db_connection()
    conn.execute('INSERT INTO chat_history (user_id, sender, message) VALUES (?, ?, ?)', (str(user_id), sender, message))
    conn.commit()
    conn.close()

def get_chat_history(user_id):
    conn = get_db_connection()
    try:
        messages = conn.execute('SELECT sender, message FROM chat_history WHERE user_id = ? ORDER BY id ASC', (str(user_id),)).fetchall()
        return [dict(msg) for msg in messages]
    finally:
        conn.close()

# FIXED: Added user_id parameter to filter/save per account
def add_schedule_item(user_id, subject, topic, task, time):
    conn = get_db_connection()
    try:
        conn.execute('INSERT INTO schedule (user_id, subject, topic, task, time) VALUES (?, ?, ?, ?, ?)', 
                     (str(user_id), subject, topic, task, time))
        conn.commit()
    finally:
        conn.close()

# FIXED: Added user_id condition to fetch only this user's schedule
def get_schedule(user_id):
    conn = get_db_connection()
    try:
        items = conn.execute('SELECT * FROM schedule WHERE user_id = ?', (str(user_id),)).fetchall()
        return [dict(ix) for ix in items]
    finally:
        conn.close()

# FIXED: Added user_id verification to prevent cross-account editing
def update_schedule_item(user_id, item_id, subject, topic, task, time):
    conn = get_db_connection()
    try:
        conn.execute('''
            UPDATE schedule 
            SET subject = ?, topic = ?, task = ?, time = ? 
            WHERE id = ? AND user_id = ?
        ''', (subject, topic, task, time, item_id, str(user_id)))
        conn.commit()
    finally:
        conn.close()

# FIXED: Added user_id verification to prevent unauthorized deletion
def delete_schedule_item(user_id, item_id):
    conn = get_db_connection()
    try:
        conn.execute('DELETE FROM schedule WHERE id = ? AND user_id = ?', (item_id, str(user_id)))
        conn.commit()
    finally:
        conn.close()
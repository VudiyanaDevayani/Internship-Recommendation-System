from flask import Flask, render_template, request, redirect, url_for, flash, session, jsonify
import sqlite3
import os
import uuid
import cv2
import pytesseract
from werkzeug.security import generate_password_hash, check_password_hash

app = Flask(__name__)
app.secret_key = "your_secret_key"  # For session and flashing messages

# Database setup
DATABASE = 'users.db'

def get_db():
    conn = sqlite3.connect(DATABASE)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    # Initialize the database with users, admins, profiles, skills, learned_skills, internships tables
    with get_db() as db:
        db.execute('''CREATE TABLE IF NOT EXISTS users (
                        id INTEGER PRIMARY KEY AUTOINCREMENT,
                        email TEXT UNIQUE,
                        password TEXT
                      )''')
        db.execute('''CREATE TABLE IF NOT EXISTS admins (
                        id INTEGER PRIMARY KEY AUTOINCREMENT,
                        email TEXT UNIQUE,
                        password TEXT
                      )''')
        db.execute('''CREATE TABLE IF NOT EXISTS profiles (
                        user_id INTEGER PRIMARY KEY,
                        name TEXT,
                        phone TEXT
                      )''')
        db.execute('''CREATE TABLE IF NOT EXISTS skills (
                        id INTEGER PRIMARY KEY AUTOINCREMENT,
                        user_id INTEGER,
                        skill TEXT
                      )''')
        db.execute('''CREATE TABLE IF NOT EXISTS learned_skills (
                        id INTEGER PRIMARY KEY AUTOINCREMENT,
                        user_id INTEGER,
                        skill TEXT
                      )''')
        db.execute('''CREATE TABLE IF NOT EXISTS internships (
                        id INTEGER PRIMARY KEY AUTOINCREMENT,
                        title TEXT,
                        sector TEXT,
                        required_skills TEXT,
                        location TEXT,
                        salary TEXT
                      )''')
        db.commit()


# Upload folder for saved files
UPLOAD_FOLDER = './uploads'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

def scan_image(file_path):
    img = cv2.imread(file_path)
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    _, thresh = cv2.threshold(gray, 150, 255, cv2.THRESH_BINARY)
    text = pytesseract.image_to_string(thresh)
    return text

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        email = request.form['email']
        password = request.form['password']
        if email == 'admin@admin.com' and password == 'admin':
            session['user_role'] = 'admin'
            session['user_id'] = 'admin'
            flash("Logged in as Admin.")
            return redirect(url_for('admin_dashboard'))
        else:
            conn = get_db()
            user = conn.execute('SELECT * FROM users WHERE email = ?', (email,)).fetchone()
            if user and check_password_hash(user['password'], password):
                session['user_id'] = user['id']
                session['user_role'] = 'user'
                flash("Logged in as User.")
                return redirect(url_for('dashboard'))
            else:
                flash("Invalid user email or password.")
                return redirect(url_for('login'))

    flash("Invalid role or credentials.")
    return render_template('login.html')

@app.route('/save_profile', methods=['POST'])
def save_profile():
    if 'user_id' not in session:
        return redirect(url_for('login'))

    user_id = session['user_id']
    email = request.form.get('email')
    name = request.form.get('name')
    phone = request.form.get('phone')

    if not email:
        flash('Email is required!')
        return redirect(url_for('dashboard'))

    conn = get_db()
    # Update email in users
    conn.execute('UPDATE users SET email = ? WHERE id = ?', (email, user_id))

    # Insert or update profiles details
    existing_profile = conn.execute('SELECT * FROM profiles WHERE user_id = ?', (user_id,)).fetchone()
    if existing_profile:
        conn.execute('UPDATE profiles SET name = ?, phone = ? WHERE user_id = ?', (name, phone, user_id))
    else:
        conn.execute('INSERT INTO profiles (user_id, name, phone) VALUES (?, ?, ?)', (user_id, name, phone))

    conn.commit()
    flash('Profile updated successfully!')
    return redirect(url_for('dashboard'))


@app.route('/register', methods=['GET', 'POST'])
def register():
    if request.method == 'POST':
        email = request.form['email']
        password = request.form['password']
        confirm_password = request.form['confirm_password']
        name = request.form.get('name')    # add field to form
        phone = request.form.get('phone')

        if password != confirm_password:
            flash("Passwords do not match.")
            return redirect(url_for('register'))

        hashed_password = generate_password_hash(password)

        conn = get_db()
        existing_user = conn.execute('SELECT * FROM users WHERE email = ?', (email,)).fetchone()

        if existing_user:
            flash("Email already exists.")
            return redirect(url_for('register'))

        conn.execute('INSERT INTO users (email, password) VALUES (?, ?)', (email, hashed_password))
        user_id = conn.execute('SELECT id FROM users WHERE email = ?', (email,)).fetchone()['id']

        # Add profile entry (ensure your register.html form has inputs for name and phone)
        conn.execute('INSERT INTO profiles (user_id, name, phone) VALUES (?, ?, ?)', (user_id, name, phone))

        conn.commit()
        flash("Registration successful! Please log in.")
        return redirect(url_for('login'))

    return render_template('register.html')


@app.route('/dashboard')
def dashboard():
    if 'user_id' not in session:
        return redirect(url_for('login'))

    role = session.get('user_role', 'user')
    if role == 'admin':
        return redirect(url_for('admin_dashboard'))
    else:
        return render_template('home.html')
@app.route('/admin_dashboard')
def admin_dashboard():
    if session.get('user_role') != 'admin':
        return redirect(url_for('login'))
    conn = get_db()
    
    # Get all users with profile info
    users = conn.execute('''
        SELECT u.id, u.email, p.name, p.phone
        FROM users u
        LEFT JOIN profiles p ON u.id = p.user_id
    ''').fetchall()

    # Collect skills and learned skills for each user
    user_skills = {}
    user_learned_skills = {}

    for user in users:
        skills = conn.execute('SELECT skill FROM skills WHERE user_id = ?', (user['id'],)).fetchall()
        learned = conn.execute('SELECT skill FROM learned_skills WHERE user_id = ?', (user['id'],)).fetchall()
        user_skills[user['id']] = [s['skill'] for s in skills]
        user_learned_skills[user['id']] = [s['skill'] for s in learned]

    print(user_skills)
    print(user_learned_skills)


    # Get all internships
    internships = conn.execute('SELECT * FROM internships').fetchall()

    return render_template('admin_dashboard.html', users=users, user_skills=user_skills,
                           user_learned_skills=user_learned_skills, internships=internships)


@app.route('/logout')
def logout():
    session.pop('user_id', None)
    session.pop('user_role', None)
    return redirect(url_for('login'))

# Resume and Certificates Upload & OCR Scanning
@app.route('/upload_resume', methods=['GET', 'POST'])
def upload_resume():
    if 'user_id' not in session:
        flash('Please login to upload resume.')
        return redirect(url_for('login'))

    if request.method == 'POST':
        if 'resume' not in request.files:
            flash('No file part')
            return redirect(request.url)
        file = request.files['resume']
        if file.filename == '':
            flash('No selected file')
            return redirect(request.url)

        file_ext = os.path.splitext(file.filename)[1]
        filename = f"{uuid.uuid4()}{file_ext}"
        file_path = os.path.join(UPLOAD_FOLDER, filename)
        file.save(file_path)

        extracted_text = scan_image(file_path)
        os.remove(file_path)

        return render_template('upload_result.html', text=extracted_text)

    return render_template('upload_form.html')
@app.route('/add_internship', methods=['GET', 'POST'])
def add_internship():
    if session.get('user_role') != 'admin':
        return redirect(url_for('login'))
    if request.method == 'POST':
        title = request.form.get('title')
        sector = request.form.get('sector')
        required_skills = request.form.get('required_skills')
        location = request.form.get('location')
        salary = request.form.get('salary')

        conn = get_db()
        conn.execute('''
            INSERT INTO internships (title, sector, required_skills, location, salary)
            VALUES (?, ?, ?, ?, ?)
        ''', (title, sector, required_skills, location, salary))
        conn.commit()
        flash('Internship added successfully.')
        return redirect(url_for('admin_dashboard'))

    return render_template('add_internship.html')


if __name__ == "__main__":
    init_db()
    app.run(debug=True)

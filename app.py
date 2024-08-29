from flask import Flask, render_template, session, request, redirect, url_for
from routes.recommendation_bp import recommendation_bp
from authentication import authenticate
import os
from dotenv import load_dotenv
import bcrypt

load_dotenv()

app = Flask(__name__, template_folder='templates', static_folder='static', static_url_path='/')
app.config['SECRET_KEY'] = os.getenv('SECRET_KEY')

HASHED_PASSWORD = os.getenv('HASHED_PASSWORD').encode('utf-8')

app.register_blueprint(recommendation_bp, url_prefix='/recommendation')
app.before_request(authenticate)


@app.route('/', methods=['POST'])
def login():

    if 'authenticated' in session:
        # If the user is already authenticated, redirect to the home page
        return redirect(url_for('home'))
    
    if request.method == 'POST':
        password = request.form['password'].encode('utf-8')

        if bcrypt.checkpw(password, HASHED_PASSWORD):
            session['authenticated'] = True
            return redirect(url_for('home'))
        
        else:
            return render_template('index.html', error="Incorrect password")
    
    return render_template('index.html')



@app.route("/")
def index():
    return render_template('index.html')

@app.route("/home")
def home():
    return render_template('home.html')

@app.route("/water-safety")
def safety():
    return render_template("water-safety.html")




if __name__ == '__main__':
    app.run(host="0.0.0.0", port=8080, debug=True)
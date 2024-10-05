from flask import Flask, render_template, session, request, redirect, url_for, jsonify
from routes.recommendation_bp import recommendation_bp
from authentication import authenticate
import os
from dotenv import load_dotenv
import bcrypt
import math


# Define your categories and item counts
categories = {
    'inform': 4,
    'colouring': 4,
    'qna': 8,
    'writing': 16
}

def get_items_for_category(category, count, page, per_page):
    start = (page - 1) * per_page
    end = start + per_page
    items = []
    for i in range(start, min(end, count)):
        items.append({
            'category': category,
            'image': f'/img/colour/{category}/{i}/cover.png',
            'pdf': f'/img/colour/{category}/{i}/file.pdf'
        })
    return items




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
            session.permanent = False
            return redirect(url_for('home'))
        
        else:
            return render_template('index.html', error="Incorrect password")
    
    return render_template('index.html', error="Incorrect password")



@app.route("/")
def index():
    return render_template('index.html')

@app.route("/home")
def home():
    return render_template('home.html')


@app.route("/historical-insights")
def historical():
    return render_template("historical-insights.html")

@app.route("/beach-education")
def safety():
    return render_template("beach-education.html")


@app.route("/emergency")
def emergency():
    return render_template("emergency-procedures.html")


@app.route("/rip-current")
def rip():
    return render_template("rip-current.html")

@app.route('/get_items/<category>')
def get_items(category):
    page = int(request.args.get('page', 1))
    per_page = int(request.args.get('per_page', 9))  # 3x3 grid

    if category == 'all':
        all_items = []
        total_count = sum(categories.values())
        for cat, count in categories.items():
            all_items.extend(get_items_for_category(cat, count, 1, total_count))
        items = all_items[(page-1)*per_page : page*per_page]
    elif category in categories:
        items = get_items_for_category(category, categories[category], page, per_page)
        total_count = categories[category]
    else:
        return jsonify({'items': [], 'total_pages': 0})

    total_pages = math.ceil(total_count / per_page)

    return jsonify({
        'items': items,
        'total_pages': total_pages
    })

@app.route("/colour")
def colour():
    return render_template("colour.html")

@app.route("/error_page")
def error():
    return render_template("error_page.html")


@app.errorhandler(404)
def page_not_found(e):
    # Render the custom error page
    return render_template('not_found.html')






if __name__ == '__main__':
    app.run(host="0.0.0.0", port=8080, debug=True)
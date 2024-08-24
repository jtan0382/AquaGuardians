from flask import Flask, render_template

app = Flask(__name__, template_folder='templates', static_folder='static', static_url_path='/')

@app.route("/")
def index():
    return render_template('index.html')

@app.route("/recommendation")
def recommendation():
    return render_template("recommendation.html")

if __name__ == '__main__':
    app.run(host="0.0.0.0", port=8080, debug=True)
from flask import Flask, render_template, request

from routes.recommendation_bp import recommendation_bp

app = Flask(__name__, template_folder='templates', static_folder='static', static_url_path='/')


app.register_blueprint(recommendation_bp, url_prefix='/recommendation')

@app.route("/")
def index():
    return render_template('index.html')

# @app.route("/recommendation")
# def recommendation():
#     latitude = request.args["latitude"]
#     longitude = request.args["longitude"]
#     return render_template("recommendation.html", latitude=latitude, longitude=longitude)

@app.route("/water-safety")
def safety():
    return render_template("water-safety.html")




if __name__ == '__main__':
    app.run(host="0.0.0.0", port=8080, debug=True)
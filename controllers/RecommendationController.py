import sys
from flask import render_template, redirect, url_for, request, abort
# from models.User import User
# from flask_sqlalchemy import SQLAlchemy
# db = SQLAlchemy()
def index():
    latitude = request.args["latitude"]
    longitude = request.args["longitude"]
    return render_template("recommendation.html", latitude=latitude, longitude=longitude)

def store():
    pass

def show(userId):
    pass

def update(userId):
    pass

def delete(userId):
    pass
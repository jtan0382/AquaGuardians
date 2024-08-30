from flask import Blueprint
from controllers.RecommendationController import index
recommendation_bp = Blueprint('recommendation_bp', __name__)
recommendation_bp.route('/', methods=['GET', 'POST'])(index)
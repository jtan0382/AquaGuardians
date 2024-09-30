from flask import Blueprint
from controllers.RecommendationController import index, detail
recommendation_bp = Blueprint('recommendation_bp', __name__)
recommendation_bp.route('/', methods=['GET', "POST"])(index)
recommendation_bp.route('/detail', methods=["POST"])(detail)
# recommendation_bp.route('/filter', methods=['GET', 'POST'])(filter)

# recommendation_bp.route('/<string:beach_name>', methods=['POST'])(detail)
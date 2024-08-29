from flask import Blueprint
from controllers.RecommendationController import index
# from RecommendationController import index
# from controllers.UserController import index, store, show, update, destroy
recommendation_bp = Blueprint('recommendation_bp', __name__)
recommendation_bp.route('/', methods=['GET'])(index)
# user_bp.route('/create', methods=['POST'])(store)
# user_bp.route('/<int:user_id>', methods=['GET'])(show)
# user_bp.route('/<int:user_id>/edit', methods=['POST'])(update)
# user_bp.route('/<int:user_id>', methods=['DELETE'])(destroy)
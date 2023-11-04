from flask import Blueprint, jsonify, request
from utils.sentiment_util import SentimentUtil

sentiment_blueprint = Blueprint('sentiment_blueprint', __name__)


# Get the sentiment from the model
@sentiment_blueprint.route('/sentiment', methods=['GET'])
def review_sentiment():
    try:
        # Load the count vectorizer, Naive Bayes model and text utilities
        su = SentimentUtil()

        # Get the review from /sentiment?review=...
        review = request.args.get('review')

        if not review:
            return jsonify({'error': 'No review provided'}), 400

        review_sentiment_string = su.get_sentiment(review)

        return jsonify({'sentiment': review_sentiment_string}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

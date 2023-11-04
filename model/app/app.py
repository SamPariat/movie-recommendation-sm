from flask import Flask
from .routes.recommendation_bp import recommendation_blueprint
from .routes.sentiment_bp import sentiment_blueprint

app = Flask(__name__)

app.register_blueprint(recommendation_blueprint)
app.register_blueprint(sentiment_blueprint)

# if __name__ == '__main__':
#     print('BTP Flask backend running on port 3524')
#     app.run(debug=True, port=3524)

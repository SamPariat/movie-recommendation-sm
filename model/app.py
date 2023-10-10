import pandas as pd
from flask import Flask, request, jsonify
import pickle
import os

app = Flask(__name__)

# Perform the prediction from the model
@app.route('/movie-prediction')
def movie_prediction():
    try:
        script_dir = os.path.dirname(os.path.abspath(__file__))

        # Load the trained movie model
        movies_pkl_path = os.path.join(script_dir, 'movies.pkl')
        movies_dict = pickle.load(open(movies_pkl_path, 'rb'))
        movies = pd.DataFrame(movies_dict)    

        # Load the cosine_similarity 2D vector
        cos_similarity_pkl_path = os.path.join(script_dir, 'cos_similarity.pkl')
        cos_similarity = pickle.load(open(cos_similarity_pkl_path, 'rb'))

        # Get the movie from /movie-prediction?movie=...
        input_movie = request.args.get('movie')

        # Fetch movie index
        movie_index = movies[movies['title'] == input_movie].index[0]
        distances = cos_similarity[movie_index]

        # Add indexes to each of the movies in the dataframe,
        # then sort by the cosine similarity values
        # then find the top 5 (excludes the current movie)
        print(distances)
        top_movies_list = sorted(list(enumerate(distances)), reverse=True, key=lambda x: x[1])[1:6]
        
        returned_movies = []
        for i in top_movies_list:
            # Convert int64 to int for json serialization=
            returned_movies.append({'id': int(movies.iloc[i[0]].movie_id), 'title': movies.iloc[i[0]].title})

        return jsonify(returned_movies), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 400

if __name__ == '__main__':
    print('BTP Flask backend running on port 3524')
    app.run(debug=True, port=3524)

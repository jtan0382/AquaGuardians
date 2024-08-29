import sys
from flask import render_template, request
from models.Recommendation import fetch_merged_data, score_beaches

def index():
    # Model parameters
    MODEL_PARAMS = {
        'a': 0.4,  # Weight for hazard rating
        'b': 0.6   # Weight for distance
    }


    latitude = float(request.args.get("latitude", 0))
    longitude = float(request.args.get("longitude", 0))
    
    # Fetch the merged data
    df_merged = fetch_merged_data()
    # print(f"merged: {df_merged}")
    
    # Calculate the top 3 beaches based on user's location
    top_beaches = score_beaches(df_merged, longitude, latitude, MODEL_PARAMS)
    print(f"beaches: {top_beaches}")


    # Render the result in the template
    return render_template("recommendation.html", latitude=latitude, longitude=longitude, top_beaches=top_beaches.to_dict(orient='records'))


def store():
    pass

def show(userId):
    pass

def update(userId):
    pass

def delete(userId):
    pass

# # Define the model parameters outside the index function
# model = {
#     'a': 0.4,  # Weight for hazard rating
#     'b': 0.6   # Weight for distance
# }

# # Now you can call the score function with the model defined
# print(score(model, 144.946457, -37.840935))

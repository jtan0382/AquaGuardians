import sys
from flask import render_template, request, session
from models.Recommendation import fetch_merged_data
import numpy as np
from haversine import haversine, Unit

# def index():
#     # Model parameters
#     MODEL_PARAMS = {
#         'a': 0.4,  # Weight for hazard rating
#         'b': 0.6   # Weight for distance
#     }


#     latitude = float(request.args.get("latitude", 0))
#     longitude = float(request.args.get("longitude", 0))
    
#     # Fetch the merged data
#     df_merged = fetch_merged_data()
#     # print(f"merged: {df_merged}")
    
#     # Calculate the top 3 beaches based on user's location
#     top_beaches = score_beaches(df_merged, longitude, latitude, MODEL_PARAMS)
#     print(f"beaches: {top_beaches}")
# TEST

#     # Render the result in the template
#     return render_template("recommendation.html", latitude=latitude, longitude=longitude, top_beaches=top_beaches.to_dict(orient='records'))


def index():

        
    if request.method == 'GET':
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
        print(top_beaches.to_dict(orient='records'))


        # Render the result in the template
        return render_template("recommendation.html", latitude=latitude, longitude=longitude, top_beaches=top_beaches.to_dict(orient='records'))

    else:
        latitude = "0213213"
        longitude = "12321312"
        return render_template("recommendation.html", latitude = latitude, longitude = longitude)

    # MODEL_PARAMS = {
    #     'a': 0.4,  # Weight for hazard rating
    #     'b': 0.6   # Weight for distance
    # }

    

    # if request.method == 'POST':
    #     data = request.get_json()
    #     latitude = data.get('latitude')
    #     longitude = data.get('longitude')


    #     # Store latitude and longitude in the session
    #     session['latitude'] = latitude
    #     session['longitude'] = longitude
        

    #             # Fetch the merged data
    #     # df_merged = fetch_merged_data()
    #     #print(f"merged: {df_merged}")
        
    #     # Calculate the top 3 beaches based on user's location
    #     # top_beaches = score_beaches(df_merged, longitude, latitude, MODEL_PARAMS)
    #     # print(f"beaches: {top_beaches}")


    #     # return render_template("recommendation.html", latitude=latitude, longitude=longitude)
    #         # Render the result in the template
    #     return render_template("recommendation.html", latitude=latitude, longitude=longitude, top_beaches="this is string")

    # else:

    #     # Retrieve latitude and longitude from the session
    #     latitude = session.get('latitude')
    #     longitude = session.get('longitude')

    #     return render_template("recommendation.html", latitude=latitude, longitude=longitude)


def calculate_distance(lat1, lon1, lat2, lon2):
    user_location = (lat1, lon1)
    beach_location = (lat2, lon2)
    return haversine(user_location, beach_location, unit=Unit.METERS)

def score_beaches(df, user_lon, user_lat, model):
    # Calculate distance for each beach
    df['distance_meters'] = df.apply(lambda row: calculate_distance(user_lat, user_lon, row['LATITUDE'], row['LONGITUDE']), axis=1)
    
    # Convert distance to kilometers
    df['distance_kilometers'] = df['distance_meters'] / 1000
    
    # Apply non-linear transformations using the model parameters
    df['transformed_hazard'] = np.exp(df['HAZARD_RAT'])
    df['transformed_distance'] = np.log1p(df['distance_meters'])
    
    # Use the model's weights for hazard and distance
    a, b = model['a'], model['b']
    
    # Calculate the score using the weighted sum of transformed values
    df['score'] = a * df['transformed_hazard'] + b * df['transformed_distance']
    
    # Sort by score to get the top 3 beaches
    top_beaches = df.sort_values(by='score').head(3)
    
    top_beaches['beach_info'] = top_beaches.apply(generate_beach_info, axis=1)
    info = top_beaches[['beach_info']].iloc[0]
    # print(info)
    # Select the required columns to display
    result = top_beaches[['BEACH_NAME', 'LATITUDE', 'LONGITUDE', 'distance_kilometers', 'image_address','beach_info']]
    print(result)

    return result

def generate_beach_info(row):
    beach_name = row['BEACH_NAME']
    hazard_rating = row['transformed_hazard']
    shops_status = 'surrounded by shops' if row['SHOPS'] == 1 else ''
    playground_status = 'has playgrounds' if row['PLAYGROUND'] == 1 else ''
    picnic_status = 'and picnic areas' if row['PICNIC'] == 1 else ''
    warning = ''
    
    if row['BLUEBOTTLE'] == 1:
        warning = 'Warning: Bluebottle jellyfish present. '
    if row['SHARKS'] == 1:
        warning = 'Warning: Sharks spotted. '
    if not warning:
        warning = 'Safe from hazardous sea life.'
    
    info = f"The {beach_name} is rated {hazard_rating} by Aquaguardians. "
    if shops_status:
        info += shops_status + '. '
    if playground_status:
        info += playground_status + ' '
    if picnic_status:
        info += picnic_status + '. '
    info += warning

    # print(info)
    return info

def detail():
    
    return render_template("recommendation.html", top_beaches="this is string")
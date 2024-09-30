from controllers.WeatherDataUsingApi import Weather
import sys
from flask import render_template, request, session
from models.Recommendation import fetch_merged_data
import numpy as np
from haversine import haversine, Unit

from controllers.WeatherDataUsingApi import Weather
import sys
from flask import render_template, request, session
from models.Recommendation import fetch_merged_data
import numpy as np
from haversine import haversine, Unit



def getTop3Beaches(longitude, latitude, MODEL_PARAMS):
    # Do inside this for fetching data.

    # Fetch the merged data
    df_merged = fetch_merged_data()
    # print(f"merged: {df_merged}")
    
    # Calculate the top 3 beaches based on user's location
    top_beaches = score_beaches(df_merged, longitude, latitude, MODEL_PARAMS)

    return top_beaches

def index():
    # Filtered data
    if request.method == "POST":
        user_address = request.form.get('user-input address-search')
        filters = request.form.getlist('filters')

        data = request.form

        # print(f"Address: {user_address}")
        # print(f"Selected Filters: {filters}")
        print(f"DATA: {user_address} and {filters}")
        # print(f"data: {data}")

        return render_template("recommendation.html", data = data, user_address = user_address, filters = filters)

    # Current Location
        
    elif request.method == 'GET':
        MODEL_PARAMS = {
        'a': 0.4,  # Weight for hazard rating
        'b': 0.6   # Weight for distance
        }


        latitude = float(request.args.get("latitude", 0))
        longitude = float(request.args.get("longitude", 0))
        
        # Fetch the merged data
        # df_merged = fetch_merged_data()
        # # print(f"merged: {df_merged}")
        
        # # Calculate the top 3 beaches based on user's location
        # top_beaches = score_beaches(df_merged, longitude, latitude, MODEL_PARAMS)
        # print(top_beaches.to_dict(orient='records'))
        top_beaches = getTop3Beaches(longitude, latitude, MODEL_PARAMS)
        
        
        print(top_beaches['BEACH_NAME'], top_beaches['safe_beaufort'])
        


        # Render the result in the template
        # return render_template("recommendation.html", latitude = latitude, longitude = longitude)

        return render_template("recommendation.html", latitude=latitude, longitude=longitude, top_beaches=top_beaches.to_dict(orient='records'))

    else:
        return render_template("recommendation.html", latitude = latitude, longitude = longitude)

    

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
    
    top_beaches['toilets'] = top_beaches['NO_TOILETS'].apply(lambda x: x > 0)
    top_beaches['showers'] = top_beaches['NO_SHOWERS'].apply(lambda x: x > 0)

    top_beaches['beach_info'] = top_beaches.apply(generate_beach_info, axis=1)
    warning_mapping = {
    'BLUEBOTTLE': 'bluebottle',
    'SHARKS': 'sharks'
    }

    amenities_mapping = {
    'toilets': 'toilet',
    'showers':'shower',
    'BBQ': 'bbq',
    'PICNIC': 'picnic',
    'PLAYGROUND': 'park'
    }

    top_beaches['amenities'] = top_beaches.apply(lambda row: ', '.join([amenities_mapping[col] for col in amenities_mapping if row[col]]), axis=1)


    top_beaches['warning'] = top_beaches.apply(lambda row: ', '.join([warning_mapping[col] for col in warning_mapping if row[col]]), axis=1)    # print(info)
    # Select the required columns to display
    result = top_beaches[['BEACH_NAME', 'LATITUDE', 'LONGITUDE', 'distance_kilometers', 'image_address','amenities','warning','beach_info']]
    weather = Weather()
    result_final = weather.get_weather_details(result)

    result_final['safety'] = result_final['beaufort_scale'].apply(lambda x: 'safe' if x < 99 else 'unsafe')
    # print(result_final)
    def aggregate_rows(group):
        static_info = group.iloc[0].copy()
    
        # Concatenate Beaufort scale values based on safety
        safe_beaufort = group.loc[group['safety'] == 'safe', 'safe_time'].astype(str).tolist()
        unsafe_beaufort = group.loc[group['safety'] == 'unsafe', 'safe_time'].astype(str).tolist()

        # Join the Beaufort values into a single string
        static_info['safe_beaufort'] = ', '.join(safe_beaufort)
        static_info['unsafe_beaufort'] = ', '.join(unsafe_beaufort)

        return static_info


    aggregated_df = result_final.groupby(
        ['BEACH_NAME', 'LATITUDE', 'LONGITUDE', 'distance_kilometers', 
        'image_address', 'amenities', 'warning', 'beach_info', 
        'sunrise', 'sunset', 'temperature_2m_max', 
        'temperature_2m_min', 'uv_index_max', 'max_wind_speed', 'safety']
        ).apply(aggregate_rows).reset_index(drop=True)
    
    aggregated_df = aggregated_df.drop_duplicates(subset='BEACH_NAME', keep='first')


    
    return aggregated_df

def generate_beach_info(row):
    beach_name = row['BEACH_NAME']
    hazard_rating = row['HAZARD_RAT']
    
    # Collect available amenities only if they are not empty
    amenities = []
    if row['SHOPS'] == 1:
        amenities.append('Shops')
    if row['PLAYGROUND'] == 1:
        amenities.append('Playgrounds')
    if row['PICNIC'] == 1:
        amenities.append('Picnic areas')
    if row['BBQ'] == 1:
        amenities.append('BBQs')

    # Handling warnings for hazardous sea life
    warning = ''
    if row['BLUEBOTTLE'] == 1:
        warning = 'Warning: Bluebottle jellyfish present. '
    if row['SHARKS'] == 1:
        warning = 'Warning: Sharks spotted. '
    if not warning:
        warning = 'Safe from hazardous sea life.'

    # Construct amenities section if there are any, otherwise skip
    amenities_str = ', '.join(amenities)
    if amenities_str:
        amenities_str = f"The available amenities are: {amenities_str}. "

    # Construct final info string
    info = f"The {beach_name} is rated {hazard_rating}/10 by The Victorian Government (1 being safest). {amenities_str}{warning}"

    return info


def detail():

    if request.method == 'POST':
        beach_name = request.form.get('beach_name')
        beach_lat = request.form.get('beach_lat')
        beach_long = request.form.get('beach_long')
        beach_warning = request.form.get('beach_warning')
        beach_amenities = request.form.get('beach_amenities')
        beach_info = request.form.get('beach_info')
        beach_temp_2m_min = request.form.get('beach_temperature_2m_min')
        beach_temp_2m_max = request.form.get('beach_temperature_2m_max')
        beach_uv = request.form.get('beach_uv')
        beach_wind = request.form.get('beach_wind')
        beach_wave = request.form.get('beach_wave')
        beach_beaufort = request.form.get('beach_beaufort')

        warning = [x.strip() for x in beach_warning.split(',')]
        amenities = [x.strip() for x in beach_amenities.split(',')]
        safe_time = [x.strip() for x in beach_beaufort.split(',')]



        # test = request.form['clothing']
        return render_template("detail.html", 
                               name = beach_name, 
                               lat = beach_lat, 
                               long = beach_long,
                               warnings = warning,
                               amenities = amenities,
                               info = beach_info,
                               temp_min = beach_temp_2m_min,
                               temp_max = beach_temp_2m_max,
                               uv = beach_uv,
                               wind = beach_wind,
                               wave = beach_wave,
                               safe_times = safe_time)    
        
    else:
        pass
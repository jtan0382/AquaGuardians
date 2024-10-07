# from controllers.WeatherDataUsingApi import Weather
# import sys
# from flask import render_template, request, session
# from models.Recommendation import fetch_merged_data
# import numpy as np
# from haversine import haversine, Unit

from controllers.WeatherDataUsingApi import Weather
import sys
from flask import render_template, request, session
from models.Recommendation import fetch_merged_data
import numpy as np
from haversine import haversine, Unit
import requests # added to call Mapbox API

from flask import render_template, request, session

from flask import render_template, request



# Currently Working index
def index():
    # Filtered data
    if request.method == "POST":
        # Debug: Print all data received from the form
        print(f"\n\n===== Form data received: {request.form} =====\n\n")

        user_address = request.form.get('user-input address-search')
        filters = request.form.getlist('filters')

        # Debug: Check the type and content of filters
        print(f"\n\n===== Filters received (type: {type(filters)}): {filters} =====\n\n")

        # Ensure filters is a list
        if isinstance(filters, str):
            filters = [filters]

        # Enforce user to input an address
        if not user_address:
            # If no address is provided, return an error message prompting the user to enter an address
            print("\n\n===== No address provided. Requesting user to enter a valid address =====\n\n")
            return render_template("error_page.html", e="Address must be entered in the search bar before searching.")
        
        # Determine coordinates to use
        if user_address:
            # Convert user address to latitude and longitude using Mapbox API
            latitude, longitude = get_coordinates_from_address(user_address)
            if latitude is None or longitude is None:
                # Handle the case where coordinates are not found
                print("\n\n===== No coordinates found for the given address =====\n\n")
                return render_template("error_page.html", e="Address not found. Please enter a valid address.")
        else:
            # Use the previous user's physical latitude and longitude
            latitude = float(request.args.get("latitude", 0))
            longitude = float(request.args.get("longitude", 0))
            if latitude == 0 and longitude == 0:
                # Handle missing coordinates
                print("\n\n===== Location data not found. Please enable location services or enter an address =====\n\n")
                return render_template("error_page.html", e="Location data not found. Please enable location services or enter an address.")

        # Fetch the merged data
        df_merged = fetch_merged_data()
        print(f"\n\n===== Total beaches before filtering: {df_merged.shape[0]} =====\n\n")

        # Apply default filter (SIGHTSEEING = True) if no user filter is selected
        if not filters:
            df_merged = df_merged[df_merged['SIGHTSEEING'] == True]
            print(f"\n\n===== Beaches after applying SIGHTSEEING filter: {df_merged.shape[0]} =====\n\n")
        else:
            # Start with the default filter for SIGHTSEEING
            conditions = (df_merged['SIGHTSEEING'] == True)

            # Add conditions for each selected filter using logical AND 
            if 'swimming' in filters:
                conditions = conditions & (df_merged['PATROL'] == True) & (df_merged['SWIM'] == True)
                print(f"\n\n===== Applying swimming filter... Beaches meeting PATROL and SWIM conditions: {df_merged[conditions].shape[0]} =====\n\n")
            
            if 'surfing' in filters:
                conditions = conditions & (df_merged['SURF'] == True)
                print(f"\n\n===== Applying surfing filter... Beaches meeting SURF condition: {df_merged[conditions].shape[0]} =====\n\n")

            if 'fishing' in filters:
                conditions = conditions & (df_merged['FISH'] == True)
                print(f"\n\n===== Applying fishing filter... Beaches meeting FISH condition: {df_merged[conditions].shape[0]} =====\n\n")

            # Apply the combined conditions to filter the DataFrame
            df_merged = df_merged[conditions]
            print(f"\n\n===== Total beaches after applying all filters: {df_merged.shape[0]} =====\n\n")

        MODEL_PARAMS = {
            'a': 0.4,  # Weight for hazard rating
            'b': 0.6   # Weight for distance
        }
        try:
            # Calculate the top 3 beaches based on user's location and filtered data
            top_beaches = getTop3Beaches(longitude, latitude, MODEL_PARAMS, df_merged)

            return render_template("recommendation.html", top_beaches=top_beaches.to_dict(orient='records'), user_address=user_address, filters=filters)
        except:
            return render_template("error_page.html", e = "Oops! Please refresh your website, there is an issue on database.")

    # Current Location if address not provided in the search bar
    elif request.method == 'GET':
        MODEL_PARAMS = {
            'a': 0.4,  # Weight for hazard rating
            'b': 0.6   # Weight for distance
        }

        latitude = float(request.args.get("latitude", 0))
        longitude = float(request.args.get("longitude", 0))

        # Fetch the merged data with default filter (SIGHTSEEING = True)
        # df_merged = fetch_merged_data()
        # df_merged = df_merged[df_merged['SIGHTSEEING'] == True]

        # Calculate the top 3 beaches based on current location with filtered data
        try:
            # Fetch the merged data with default filter (SIGHTSEEING = True)
            df_merged = fetch_merged_data()
            df_merged = df_merged[df_merged['SIGHTSEEING'] == True]
            top_beaches = getTop3Beaches(longitude, latitude, MODEL_PARAMS, df_merged)
            print(f"safe time: {top_beaches['safe_beaufort']}")


            print(f"\n\n===== Beaches based on current location: {top_beaches['BEACH_NAME']} =====\n\n")

            return render_template("recommendation.html", latitude=latitude, longitude=longitude, top_beaches=top_beaches.to_dict(orient='records'))
        except:
            return render_template("error_page.html", e = "Oops! Please refresh your website, there is an issue on database.")


    else:
        return render_template("error_page.html", e="Please allow the location's permission")




# Restored Original Version of getTop3Beaches
def getTop3Beaches(longitude, latitude, MODEL_PARAMS, df_merged):
    # Calculate the top 3 beaches based on user's location
    top_beaches = score_beaches(df_merged, longitude, latitude, MODEL_PARAMS)
    return top_beaches


# #Original Version
# def getTop3Beaches(longitude, latitude, MODEL_PARAMS):
#     # Do inside this for fetching data.

#     # Fetch the merged data
#     df_merged = fetch_merged_data()
#     # print(f"merged: {df_merged}")
    
#     # Calculate the top 3 beaches based on user's location
#     top_beaches = score_beaches(df_merged, longitude, latitude, MODEL_PARAMS)

#     return top_beaches


# #Original Version
# def index():
#     # Filtered data
#     if request.method == "POST":
#         user_address = request.form.get('user-input address-search')
#         filters = request.form.getlist('filters')

#         data = request.form

#         # print(f"Address: {user_address}")
#         # print(f"Selected Filters: {filters}")
#         print(f"DATA: {user_address} and {filters}")
#         # print(f"data: {data}")

#         return render_template("recommendation.html", data = data, user_address = user_address, filters = filters)

#     # Current Location if address not provided in the search bar
        
#     elif request.method == 'GET':
#         MODEL_PARAMS = {
#         'a': 0.4,  # Weight for hazard rating
#         'b': 0.6   # Weight for distance
#         }


#         latitude = float(request.args.get("latitude", 0))
#         longitude = float(request.args.get("longitude", 0))
        
#         # Fetch the merged data
#         # df_merged = fetch_merged_data()
#         # # print(f"merged: {df_merged}")
        
#         # # Calculate the top 3 beaches based on user's location
#         # top_beaches = score_beaches(df_merged, longitude, latitude, MODEL_PARAMS)
#         # print(top_beaches.to_dict(orient='records'))
#         top_beaches = getTop3Beaches(longitude, latitude, MODEL_PARAMS)
        
        
#         print(top_beaches['BEACH_NAME'], top_beaches['safe_beaufort'])
        


#         # Render the result in the template
#         # return render_template("recommendation.html", latitude = latitude, longitude = longitude)

#         return render_template("recommendation.html", latitude=latitude, longitude=longitude, top_beaches=top_beaches.to_dict(orient='records'))

#     else:
#         return render_template("recommendation.html", latitude = latitude, longitude = longitude)



   

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
    result = top_beaches[['BEACH_NAME', 'LATITUDE', 'LONGITUDE', 'distance_kilometers', 'image_address','amenities','warning','beach_info','safety_rating']] #safety_rating added
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
        'temperature_2m_min', 'uv_index_max', 'max_wind_speed', 'safety','safety_rating'] #safety_rating added
        ).apply(aggregate_rows).reset_index(drop=True)
    # #safe_beaufort  added, delete the perivous thing if wannting to apply changes
    #     ['BEACH_NAME', 'LATITUDE', 'LONGITUDE', 'distance_kilometers', 
    #     'image_address', 'amenities', 'warning', 'beach_info', 
    #     'sunrise', 'sunset', 'temperature_2m_max', 
    #     'temperature_2m_min', 'uv_index_max', 'max_wind_speed', 'safety','safety_rating','safe_beaufort'] #safety_rating added and safe_beaufort added
    #     ).apply(aggregate_rows).reset_index(drop=True)
    
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
        beach_image = request.form.get('beach_image')
        beach_lat = request.form.get('beach_lat')
        beach_long = request.form.get('beach_long')
        beach_warning = request.form.get('beach_warning')
        beach_amenities = request.form.get('beach_amenities')
        beach_info = request.form.get('beach_info')
        beach_temp_2m_min = round(float(request.form.get('beach_temperature_2m_min')))
        beach_temp_2m_max = round(float(request.form.get('beach_temperature_2m_max')))
        beach_uv = round(float(request.form.get('beach_uv')),2)
        beach_wind = round(float(request.form.get('beach_wind')), 2)
        beach_wave = round(float(request.form.get('beach_wave')), 2)
        beach_beaufort = request.form.get('safe_beaufort')
        safety_rating = request.form.get('safety_rating') # safety_rating added
        sunrise = request.form.get('sunrise')
        sunset = request.form.get('sunset')

        # Initialize variables as empty lists
        warning = []
        amenities = []
        
        if beach_warning:
            warning = [x.strip() for x in beach_warning.split(',')]

        if beach_amenities:
            amenities = [x.strip() for x in beach_amenities.split(',')]

        



        # test = request.form['clothing']
        return render_template("detail.html", 
                               name = beach_name, 
                               image = beach_image,
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
                               safety_rating = safety_rating,
                               safe_times = beach_beaufort)    
        
    else:
        pass


def get_coordinates_from_address(address):
    #mapbox_token can be replaced with other accounts
    mapbox_token = "pk.eyJ1IjoienpobzAwNDQiLCJhIjoiY2xsb3VxNGhrMDAwZzNlbjM3eXllaHh1bCJ9.lD_ws4oyrrhimYBAT8vk2w"
    base_url = f"https://api.mapbox.com/geocoding/v5/mapbox.places/{address}.json"
    params = {
        "access_token": mapbox_token,
        "limit": 1
    }

    response = requests.get(base_url, params=params)
    if response.status_code == 200:
        data = response.json()
        if len(data['features']) > 0:
            coordinates = data['features'][0]['geometry']['coordinates']
            longitude, latitude = coordinates
            return latitude, longitude
        else:
            print("No coordinates found for the given address.")
            return None, None
    else:
        print(f"Error: {response.status_code}, {response.text}")
        return None, None
    


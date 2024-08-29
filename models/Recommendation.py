import pandas as pd
import numpy as np
from haversine import haversine, Unit
from config import get_db_connection

def fetch_merged_data():
    # Establish a database connection
    conn = get_db_connection()
    
    # SQL query to fetch merged data
    query = """SELECT beach_facilities_safety.[KEY], BEACH_NAME, LATITUDE, LONGITUDE, HAZARD_RAT, image_address
           FROM beach_facilities_safety
           JOIN beach_longlat
               ON beach_facilities_safety.[KEY] = beach_longlat.[KEY]
           JOIN beach_image
               ON beach_facilities_safety.[KEY] = beach_image.[KEY]"""
               
    # Fetch data into a pandas DataFrame
    table = pd.read_sql(query, conn)
    conn.close()
    
    return table

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
    
    # Select the required columns to display
    result = top_beaches[['BEACH_NAME', 'LATITUDE', 'LONGITUDE', 'distance_kilometers', 'image_address']]
    
    return result

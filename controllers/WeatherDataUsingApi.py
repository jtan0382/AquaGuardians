import openmeteo_requests
import requests_cache
import pandas as pd
from retry_requests import retry
import requests
from datetime import datetime
from datetime import datetime, timedelta
import pytz

class Weather: 

    def get_weather_details(
            self,
            beach_df
    ):
        beach_df['key'] = range(1, len(beach_df)+1)
        # print("*"*40)
        # print("Beach DF")
        # print("*"*40)
        # print(beach_df)
        # print("*"*40)
        latitudes = beach_df['LATITUDE'].tolist()
        longitudes = beach_df['LONGITUDE'].tolist()
        df_sun_details = self.get_multiple_sunrise_sunset(latitudes=latitudes, longitudes=longitudes)
        # print(df_sun_details)
        # print("*"*40)
        df_daily_details, df_safe_hourly = self.get_weather_data(latitudes, longitudes)
        # print("Daily Details")
        # print(df_daily_details)
        # print("*"*40)
        # print(df_safe_hourly)
        # print("*"*40)
        
        df_merged_1 = pd.merge(beach_df, df_sun_details, on='key', how='inner')
        df_merged_1['date'] = pd.to_datetime(df_merged_1['date']).dt.date
        df_daily_details['date_daily'] = pd.to_datetime(df_daily_details['date_daily']).dt.date
        df_merged_2 = pd.merge(df_merged_1, 
                               df_daily_details[['temperature_2m_max','temperature_2m_min','uv_index_max','max_wind_speed','key', 'date_daily']],
                               left_on=['key', 'date'],
                               right_on=['key', 'date_daily'],
                               how='inner'
                               )
        df_merged_2['date'] = pd.to_datetime(df_merged_2['date']).dt.date
        df_safe_hourly['safe_date'] = pd.to_datetime(df_safe_hourly['safe_date']).dt.date
        final_df = pd.merge(df_merged_2, 
                            df_safe_hourly[['wave_height','visibility','beaufort_scale','safe_date','safe_time','key']], 
                            left_on=['key','date'],
                            right_on=['key','safe_date'], 
                            how='inner')

        #filtering data 
        filter_date_df = df_sun_details.groupby('date').agg(
            sunrise_min=('sunrise', 'min'),
            sunset_max=('sunset', 'max')
        ).reset_index()

        australia_tz = pytz.timezone('Australia/Melbourne')
        current_time = datetime.now(australia_tz).time()

        # Today's date
        today = datetime.now(australia_tz).strftime('%Y-%m-%d')
        # Date filter
        for i, row in filter_date_df.iterrows():
            if row['date'] == today:
                sunset_time = datetime.strptime(row['sunset_max'], '%H:%M').time()
                if current_time > sunset_time:
                    filter_date_val = (datetime.now(australia_tz) + timedelta(days=1)).strftime('%Y-%m-%d')
                
                else:
                    filter_date_val = today
            break

        filter_date_val = pd.to_datetime(filter_date_val).date()    
        # print(filter_date_val)
        # print(type(filter_date_val))    
        final_df['date'] = pd.to_datetime(final_df['date']).dt.date    
        filter_final_df = final_df.loc[final_df['date'] == filter_date_val]
        # print("*"*40)
        # print("Dtytpes")
        # print(final_df.dtypes)
        # print("*"*40)
        # print("Final DF")
        # print(filter_final_df)
        return filter_final_df

        
    def get_sunrise_sunset(self, lat, lon):

        url = 'https://api.open-meteo.com/v1/forecast'
        params = {
            'latitude': lat,
            'longitude': lon,
            'daily': 'sunrise,sunset',
            'timezone': 'Australia/Sydney',
            "forecast_days": 2,
            'models': 'cma_grapes_global'
        }
        
        # Make the API request
        response = requests.get(url, params=params)
        
        # Parse the response JSON
        data = response.json()
        
        # Extract the sunrise and sunset times
        time = data['daily']['time']
        sunrise = [sr.split('T')[1] for sr in data['daily']['sunrise']]  
        sunset = [ss.split('T')[1] for ss in data['daily']['sunset']]
        # sunrise = data['daily']['sunrise']
        # sunset = data['daily']['sunset']
        
        # Return a dictionary with the date, sunrise, and sunset
        return [{'date': t, 'sunrise': sr, 'sunset': ss} for t, sr, ss in zip(time, sunrise, sunset)]
    
    def get_multiple_sunrise_sunset(self, latitudes, longitudes):
        """Fetch sunrise and sunset data for multiple locations using latitude and longitude lists."""
        results = []
        
        # Loop through the list of latitudes and longitudes
        for index, (lat, lon) in enumerate(zip(latitudes, longitudes), start=1):
            result = self.get_sunrise_sunset(lat, lon)
            
            # For each entry in the result, add a key with the index, lat, lon, and the result
            for entry in result:
                results.append({
                    'key': index,
                    'latitude': lat,
                    'longitude': lon,
                    'date': entry['date'],
                    'sunrise': entry['sunrise'],
                    'sunset': entry['sunset']
                })
        
        # Convert the list of dictionaries to a DataFrame
        df = pd.DataFrame(results)
        return df
    
    def get_weather_data(self,latitudes:list,longitudes:list):

        cache_session = requests_cache.CachedSession('.cache', expire_after = 3600)
        retry_session = retry(cache_session, retries = 5, backoff_factor = 0.2)
        openmeteo = openmeteo_requests.Client(session = retry_session)

        # Make sure all required weather variables are listed here
        # The order of variables in hourly or daily is important to assign them correctly below
        url = "https://api.open-meteo.com/v1/forecast"
        params = {
            "latitude": latitudes,
            "longitude": longitudes,
            "hourly": ["temperature_2m", "apparent_temperature", "precipitation_probability", "precipitation", "visibility", "wind_speed_10m"],
            "daily": ["temperature_2m_max", "temperature_2m_min", "sunrise", "sunset", "daylight_duration", "sunshine_duration", "uv_index_max","wind_speed_10m_max"],
            "timeformat": "unixtime",
            "timezone": "Australia/Sydney",
            "forecast_days": 2,
            "models": "best_match"
        }
        responses = openmeteo.weather_api(url, params=params)

        #Daily weather Data
        all_daily_data = []
        for idx, response in enumerate(responses):
            # Extract latitude and longitude for each location
            latitude = response.Latitude()
            longitude = response.Longitude()
            
            # Process daily data
            daily = response.Daily()
            daily_temperature_2m_max = daily.Variables(0).ValuesAsNumpy()
            daily_temperature_2m_min = daily.Variables(1).ValuesAsNumpy()
            daily_sunrise = daily.Variables(2).ValuesAsNumpy()
            daily_sunset = daily.Variables(3).ValuesAsNumpy()
            daily_daylight_duration = daily.Variables(4).ValuesAsNumpy()
            daily_sunshine_duration = daily.Variables(5).ValuesAsNumpy()
            daily_uv_index_max = daily.Variables(6).ValuesAsNumpy()
            daily_wind_speed_max = daily.Variables(7).ValuesAsNumpy()
            timezone_offset = pd.Timedelta(seconds=response.UtcOffsetSeconds())
            # Create date range
            daily_data = {"date": pd.date_range(
                start=pd.to_datetime(daily.Time(), unit="s", utc=True) + timezone_offset,
                end=pd.to_datetime(daily.TimeEnd(), unit="s", utc=True) + timezone_offset,
                freq=pd.Timedelta(seconds=daily.Interval()),
                inclusive="left"
            )}
            
            # Add latitude and longitude
            daily_data["latitude"] = latitude
            daily_data["longitude"] = longitude
            
            # Add daily weather variables
            daily_data["temperature_2m_max"] = daily_temperature_2m_max
            daily_data["temperature_2m_min"] = daily_temperature_2m_min
            daily_data["daylight_duration"] = daily_daylight_duration
            daily_data["sunshine_duration"] = daily_sunshine_duration
            daily_data["uv_index_max"] = daily_uv_index_max
            daily_data["max_wind_speed"] = daily_wind_speed_max
            daily_data["key"] = idx+1
            
            # Convert the dictionary to a DataFrame for this response
            daily_dataframe = pd.DataFrame(data=daily_data)
            
            # Append to all_daily_data list
            all_daily_data.append(daily_dataframe)

        # Concatenate all the daily dataframes into one
        daily_weather_dataframe = pd.concat(all_daily_data, ignore_index=True)
        daily_weather_dataframe.rename(columns={'date': 'date_daily'}, inplace=True)
        daily_weather_dataframe['date_daily'] = daily_weather_dataframe['date_daily'].dt.date

        #hourly data
        all_data = []
        for idx, response in enumerate(responses):
            # Extract latitude and longitude for each location
            latitude = response.Latitude()
            longitude = response.Longitude()
            
            # Process hourly data. The order of variables needs to be the same as requested.
            hourly = response.Hourly()
            hourly_temperature_2m = hourly.Variables(0).ValuesAsNumpy()
            hourly_apparent_temperature = hourly.Variables(1).ValuesAsNumpy()
            hourly_precipitation_probability = hourly.Variables(2).ValuesAsNumpy()
            hourly_precipitation = hourly.Variables(3).ValuesAsNumpy()
            hourly_visibility = hourly.Variables(4).ValuesAsNumpy()
            hourly_wind_speed_10m = hourly.Variables(5).ValuesAsNumpy()
            timezone_offset = pd.Timedelta(seconds = response.UtcOffsetSeconds())
            # Create date range
            hourly_data = {"date": pd.date_range(
                start=pd.to_datetime(hourly.Time(), unit="s", utc=True) + timezone_offset,
                end=pd.to_datetime(hourly.TimeEnd(), unit="s", utc=True) + timezone_offset,
                freq=pd.Timedelta(seconds=hourly.Interval()),
                inclusive="left"
            )}
            
            # Add latitude and longitude
            hourly_data["latitude"] = latitude
            hourly_data["longitude"] = longitude
            
            # Add other weather variables
            hourly_data["temperature_2m"] = hourly_temperature_2m
            hourly_data["apparent_temperature"] = hourly_apparent_temperature
            hourly_data["precipitation_probability"] = hourly_precipitation_probability
            hourly_data["precipitation"] = hourly_precipitation
            hourly_data["visibility"] = hourly_visibility
            hourly_data["wind_speed_10m"] = hourly_wind_speed_10m
            hourly_data["key"] = idx+1
            # Convert the dictionary to a DataFrame for this response
            hourly_dataframe = pd.DataFrame(data=hourly_data)
            
            # Append to all_data list
            all_data.append(hourly_dataframe)

        # Concatenate all the dataframes into one
        weather_hourly_dataframe = pd.concat(all_data, ignore_index=True)
        weather_hourly_dataframe['date'] = weather_hourly_dataframe['date'].dt.tz_convert(None)


        #GET MARINE DATA
        cache_session = requests_cache.CachedSession('.cache', expire_after = 3600)
        retry_session = retry(cache_session, retries = 5, backoff_factor = 0.2)
        openmeteo = openmeteo_requests.Client(session = retry_session)

        # Make sure all required weather variables are listed here
        # The order of variables in hourly or daily is important to assign them correctly below
        url = "https://marine-api.open-meteo.com/v1/marine"
        params = {
            "latitude": latitudes,
            "longitude": longitudes,
            "hourly": "wave_height",
            "forecast_days": 2,
            "timeformat": "unixtime",
            "timezone": "Australia/Sydney",
            "models": "best_match"
            
        }
        responses = openmeteo.weather_api(url, params=params)

        all_marine_data = []

        # Loop through each response for different locations
        for idx, response in enumerate(responses):
            # Extract latitude and longitude for each location
            latitude = response.Latitude()
            longitude = response.Longitude()
            
            # Get timezone offset for each location
            timezone_offset = pd.Timedelta(seconds=response.UtcOffsetSeconds())
            
            # Process hourly data for marine variables
            hourly = response.Hourly()
            hourly_wave_height = hourly.Variables(0).ValuesAsNumpy()

            # Create date range for each location with timezone adjustment
            hourly_data = {"date": pd.date_range(
                start=pd.to_datetime(hourly.Time(), unit="s", utc=True) + timezone_offset,
                end=pd.to_datetime(hourly.TimeEnd(), unit="s", utc=True) + timezone_offset,
                freq=pd.Timedelta(seconds=hourly.Interval()),
                inclusive="left"
            )}
            
            # Add latitude and longitude
            hourly_data["latitude"] = latitude
            hourly_data["longitude"] = longitude
            
            # Add marine-specific data like wave height
            hourly_data["wave_height"] = hourly_wave_height
            hourly_data["key"] = idx+1
            # Convert the dictionary to a DataFrame for this response
            marine_hourly_dataframe = pd.DataFrame(data=hourly_data)
            
            # Append to the all_marine_data list
            all_marine_data.append(marine_hourly_dataframe)

        # Concatenate all marine hourly dataframes into one
        marine_hourly_dataframe = pd.concat(all_marine_data, ignore_index=True)
        marine_hourly_dataframe['date'] = marine_hourly_dataframe['date'].dt.tz_convert(None)

        df_hourly_final = pd.merge(
            marine_hourly_dataframe,
            weather_hourly_dataframe,
            on=['date','key'],
            how='inner' )

        #Beaufort calculation 

        def beaufort_scale(wind_speed, wave_height):
            
            if wind_speed < 0.0 and wave_height < 0.0:
                return 0  # Calm
            elif 0 <= wind_speed < 2 and wave_height < 0.0:
                return 1  # Light air
            elif 2 <= wind_speed < 3 and wave_height < 1.0:
                return 2  # Light breeze
            elif 3 <= wind_speed < 5 and wave_height < 1.0:
                return 3  # Gentle breeze
            elif 5 <= wind_speed < 8 and 1 <= wave_height < 2:
                return 4  # Moderate breeze
            else :
                return 99
            
        # Apply the function to the dataframe
        df_hourly_final['beaufort_scale'] = df_hourly_final.apply(lambda row: beaufort_scale(row['wind_speed_10m'], row['wave_height']), axis=1)

        #df_hourly_final = df_hourly_final[df_hourly_final['beaufort_scale'] < 99]
        df_hourly_final.rename(columns={'date': 'date_safe'}, inplace=True)
        df_hourly_final['safe_date'] = df_hourly_final['date_safe'].dt.date
        df_hourly_final['safe_time'] = df_hourly_final['date_safe'].dt.time

        return daily_weather_dataframe, df_hourly_final


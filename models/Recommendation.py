from config import get_db_connection
import pandas as pd


def fetch_merged_data():
    # Establish a database connection
    conn = get_db_connection()
    
    # SQL query to fetch merged data
    query = """SELECT *
           FROM beach_facilities_safety
           JOIN beach_longlat
               ON beach_facilities_safety.[KEY] = beach_longlat.[KEY]
           JOIN beach_image
               ON beach_facilities_safety.[KEY] = beach_image.[KEY]"""
               
    # Fetch data into a pandas DataFrame
    table = pd.read_sql(query, conn)
    conn.close()
    
    return table

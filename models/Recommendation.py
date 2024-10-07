from config import get_db_connection
import pandas as pd


def fetch_merged_data():
    # Establish a database connection
    conn = get_db_connection()
    
    # SQL query to fetch merged data
    query = """SELECT *
           FROM beach_activities
        JOIN beach_facilities
            ON beach_activities.[KEY] = beach_facilities.[KEY]
        JOIN beach_haz
            ON beach_activities.[KEY] = beach_haz.[KEY]
        JOIN beach_img
            ON beach_activities.[KEY] = beach_img.[KEY]
        JOIN beach_longlat
            ON beach_activities.[KEY] = beach_longlat.[KEY]
        JOIN beach_name
            ON beach_activities.[KEY] = beach_name.[KEY]
        JOIN beach_rating
            ON beach_activities.[KEY] = beach_rating.[KEY]
        JOIN beach_warnings
            ON beach_activities.[KEY] = beach_warnings.[KEY]"""
               
    # Fetch data into a pandas DataFrame
    table = pd.read_sql(query, conn)
    conn.close()
    # Drop duplicate columns
    table = table.loc[:, ~table.columns.duplicated()]
    
    return table
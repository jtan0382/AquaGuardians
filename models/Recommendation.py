from config import get_db_connection
import pandas as pd
import pyodbc

# # Database configuration
# DATABASE_CONFIG = {
#     "DRIVER": "ODBC Driver 18 for SQL Server",
#     "SERVER": "tcp:tp04-gaurdians.database.windows.net,1433",
#     "DATABASE": "tp04-azure-db",
#     "UID": "tp04",
#     "PWD": "monash@5120",
#     "ENCRYPT": "yes",
#     "TRUST_SERVER_CERTIFICATE": "no",
#     "CONNECTION_TIMEOUT": 30,
# }

# def get_db_connection():
#     conn_str = (
#         f"Driver={DATABASE_CONFIG['DRIVER']};"
#         f"Server={DATABASE_CONFIG['SERVER']};"
#         f"Database={DATABASE_CONFIG['DATABASE']};"
#         f"Uid={DATABASE_CONFIG['UID']};"
#         f"Pwd={DATABASE_CONFIG['PWD']};"
#         f"Encrypt={DATABASE_CONFIG['ENCRYPT']};"
#         f"TrustServerCertificate={DATABASE_CONFIG['TRUST_SERVER_CERTIFICATE']};"
#         f"Connection Timeout={DATABASE_CONFIG['CONNECTION_TIMEOUT']};"
#     )
#     return pyodbc.connect(conn_str)



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

# try:
#     table = fetch_merged_data()
#     print(table)
# except Exception as e:
#     print(f"An error occurred: {e}")
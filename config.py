# config.py

import pyodbc

# Database configuration
DATABASE_CONFIG = {
    "DRIVER": "ODBC Driver 18 for SQL Server",
    "SERVER": "tcp:tp04-gaurdians.database.windows.net,1433",
    "DATABASE": "tp04-azure-db",
    "UID": "tp04",
    "PWD": "monash@5120",
    "ENCRYPT": "yes",
    "TRUST_SERVER_CERTIFICATE": "no",
    "CONNECTION_TIMEOUT": 30,
}

def get_db_connection():
    conn_str = (
        f"Driver={DATABASE_CONFIG['DRIVER']};"
        f"Server={DATABASE_CONFIG['SERVER']};"
        f"Database={DATABASE_CONFIG['DATABASE']};"
        f"Uid={DATABASE_CONFIG['UID']};"
        f"Pwd={DATABASE_CONFIG['PWD']};"
        f"Encrypt={DATABASE_CONFIG['ENCRYPT']};"
        f"TrustServerCertificate={DATABASE_CONFIG['TRUST_SERVER_CERTIFICATE']};"
        f"Connection Timeout={DATABASE_CONFIG['CONNECTION_TIMEOUT']};"
    )
    return pyodbc.connect(conn_str)


# authentication.py

from flask import redirect, url_for, session, request

# List of routes that don't require authentication
EXEMPT_ROUTES = ['login', 'index', 'home', 'historical-insights', 'detail', "beach-education", "emergency", "colour"]

def authenticate():
    """Check if the user is authenticated before accessing any route."""
    if 'authenticated' not in session and request.endpoint not in EXEMPT_ROUTES:
    # if 'authenticated' not in session:
        return redirect(url_for('index'))

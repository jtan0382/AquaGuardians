# authentication.py

from flask import redirect, url_for, session, request

# List of routes that don't require authentication
EXEMPT_ROUTES = ['index', 'login', 'recommendation']

def authenticate():
    """Check if the user is authenticated before accessing any route."""
    if 'authenticated' not in session and request.endpoint not in EXEMPT_ROUTES:
        return redirect(url_for('index'))

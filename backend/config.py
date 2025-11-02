"""
Configuration settings for the Flask application.

This module centralizes all configuration variables, making it easy to manage
different environments (development, testing, production) and keeping sensitive
data organized. Using a Config class is a Flask best practice that improves
maintainability and security.

Environment-specific settings can be easily extended by creating subclasses
like DevelopmentConfig, ProductionConfig, etc.
"""

import os
from datetime import timedelta

class Config:
    """
    Base configuration class containing all application settings.
    
    We're using SQLite for simplicity in this assessment, but this structure
    makes it trivial to switch to PostgreSQL or MySQL in production by just
    changing the SQLALCHEMY_DATABASE_URI.
    """
    
    # Secret key for session management and security features
    # In production, this should NEVER be hardcoded. Use environment variables instead:
    # SECRET_KEY = os.environ.get('SECRET_KEY') or generate a secure random key
    SECRET_KEY = os.environ.get('SECRET_KEY', 'dev-secret-key-change-in-production')
    
    # Database configuration
    # We're using SQLite which creates a file-based database - perfect for development
    # The database file will be created in the backend directory as 'todos.db'
    # For production with PostgreSQL, you'd use something like:
    # 'postgresql://username:password@localhost/todo_db'
    SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL', 'sqlite:///todos.db')
    
    # Disable SQLAlchemy event system
    # This feature tracks modifications to objects and emits signals, which adds overhead
    # We don't need it for this application, so we're turning it off to improve performance
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    
    # JSON configuration
    # Ensure JSON responses are sorted alphabetically by key
    # This makes the API output more predictable and easier to read during testing
    JSON_SORT_KEYS = False
    
    # Enable pretty-printed JSON in development
    # Makes API responses more readable when testing with curl or Postman
    JSONIFY_PRETTYPRINT_REGULAR = True
    
    # CORS settings
    # In production, replace '*' with your actual frontend domain for better security
    CORS_ORIGINS = os.environ.get('CORS_ORIGINS', '*')
    
    # API Configuration
    # These settings help maintain API consistency and can be used for versioning
    API_VERSION = '1.0.0'
    API_TITLE = 'Todo API'
    
    # Pagination settings (for future enhancement)
    # If you later add pagination to GET /api/todos, these settings will be useful
    TODOS_PER_PAGE = 20
    MAX_TODOS_PER_PAGE = 100
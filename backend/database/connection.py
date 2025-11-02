"""
Database connection and initialization module.

This module sets up the SQLAlchemy database instance and provides utility
functions for database initialization. Separating database setup into its own
module follows the single responsibility principle and makes testing easier.

By creating the db instance here, we avoid circular import issues that can
occur when models and routes need to access the database.
"""

from flask_sqlalchemy import SQLAlchemy

# Create the SQLAlchemy database instance
# This object provides access to all SQLAlchemy functionality including
# the query API, session management, and model base class
# We initialize it here and then bind it to the Flask app in app.py
db = SQLAlchemy()

def init_db():
    """
    Initialize the database by creating all tables.
    
    This function creates all tables defined in our models (currently just the Todo model).
    It's idempotent, meaning it's safe to call multiple times - it won't recreate
    existing tables or lose data.
    
    In a production application, you'd typically use database migrations (like Alembic)
    to manage schema changes over time. Migrations give you:
    - Version control for your database schema
    - Ability to rollback changes
    - Safe schema updates in production
    
    However, for this assessment, db.create_all() is simpler and sufficient.
    
    This must be called within a Flask application context, which is why we
    call it from app.py using `with app.app_context():`
    """
    # create_all() examines all models that inherit from db.Model
    # and creates their corresponding tables if they don't exist
    db.create_all()
    print("✅ Database tables created successfully")

def drop_db():
    """
    Drop all database tables.
    
    This is a utility function useful for testing and development when you want
    to reset the database to a clean state. Be careful with this in production!
    
    In a real application, you'd protect this with environment checks:
    if app.config['ENV'] == 'development':
        drop_db()
    """
    db.drop_all()
    print("🗑️  Database tables dropped")

def reset_db():
    """
    Reset the database by dropping and recreating all tables.
    
    Convenience function that combines drop_db() and init_db().
    Useful for testing scenarios where you want a fresh database state.
    
    Again, this should be environment-guarded in production:
    if app.config['TESTING']:
        reset_db()
    """
    drop_db()
    init_db()
    print("🔄 Database reset complete")
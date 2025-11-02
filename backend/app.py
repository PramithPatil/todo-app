"""
Main application entry point for the Todo API backend.

This file initializes the Flask application, configures CORS for frontend communication,
registers API routes, and sets up the database. It serves as the central orchestrator
that brings together all the modular components of our backend architecture.

We're using Flask because it's lightweight, easy to understand, and perfect for
building RESTful APIs. The modular structure separates concerns, making the codebase
maintainable and scalable for future enhancements.
"""

from flask import Flask
from flask_cors import CORS
from database.connection import db, init_db
from routes.todo_routes import todo_bp
from config import Config

# Initialize Flask application
# We're creating the core application instance that will handle all incoming HTTP requests
app = Flask(__name__)

# Load configuration from Config class
# This approach allows us to easily switch between development, testing, and production configs
app.config.from_object(Config)

# Initialize CORS (Cross-Origin Resource Sharing)
# This is crucial for allowing our React frontend (running on localhost:3000) to communicate
# with this backend API (running on localhost:5000). Without CORS, browsers block these requests
# for security reasons. We're explicitly allowing all origins in development, but in production,
# you'd want to restrict this to your actual frontend domain.
CORS(app, resources={
    r"/api/*": {
        "origins": "*",  # Temporary - allows all origins
        "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        "allow_headers": ["Content-Type", "Authorization"],
        "supports_credentials": False
    }
})

# Initialize the database with the Flask app context
# SQLAlchemy needs to be bound to our Flask app to work properly with Flask's application context
db.init_app(app)

# Register the todo blueprint for handling all todo-related routes
# Blueprints are Flask's way of organizing routes into modules. This keeps our code clean
# and makes it easy to add more resource types (like users, projects, etc.) in the future
# without cluttering the main app file. All todo routes will be prefixed with /api
app.register_blueprint(todo_bp, url_prefix='/api')

# Create database tables before the first request
# This ensures our database schema is set up before any API calls are made
# In production, you'd typically use database migrations (like Alembic) instead
with app.app_context():
    init_db()

# Root endpoint to verify the API is running
# This is helpful for health checks and debugging deployment issues
@app.route('/')
def home():
    """
    Health check endpoint.
    Returns a simple message to confirm the API is running and accessible.
    """
    return {
        "message": "Todo API is running",
        "status": "healthy",
        "version": "1.0.0"
    }, 200

# Error handler for 404 Not Found errors
# Provides clear, consistent error responses when users hit non-existent endpoints
@app.errorhandler(404)
def not_found(error):
    """
    Handle 404 errors with a JSON response instead of HTML.
    This maintains API consistency and makes debugging easier for frontend developers.
    """
    return {
        "error": "Endpoint not found",
        "message": "The requested resource does not exist"
    }, 404

# Error handler for 500 Internal Server errors
# Catches unexpected errors and returns them in a structured format
@app.errorhandler(500)
def internal_error(error):
    """
    Handle internal server errors gracefully.
    In production, you'd want to log these errors to a monitoring service
    and hide detailed error messages from users for security.
    """
    return {
        "error": "Internal server error",
        "message": "Something went wrong on our end"
    }, 500

# Application entry point
# Only runs when this file is executed directly (not when imported as a module)
if __name__ == '__main__':
    # Run the Flask development server
    # debug=True enables hot reloading and detailed error pages during development
    # In production, you'd use a production WSGI server like Gunicorn instead
    app.run(
        debug=True,  # Enable debug mode for development
        host='0.0.0.0',  # Listen on all network interfaces
        port=5000  # Run on port 5000
    )
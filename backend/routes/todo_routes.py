"""
API routes for todo operations.

This module defines all the HTTP endpoints for our Todo API. We're using Flask
blueprints to keep routes organized and modular. Blueprints are like mini-applications
that can be registered with the main Flask app.

The routes handle HTTP requests and delegate business logic to controllers,
following the MVC (Model-View-Controller) pattern. This separation makes the
code more testable and maintainable.
"""

from flask import Blueprint, request, jsonify
from controllers.todo_controller import (
    get_all_todos,
    get_todo_by_id,
    create_todo,
    update_todo,
    delete_todo
)

# Create a Blueprint for todo-related routes
# Blueprints allow us to group related routes together and register them with the app
# The first parameter 'todos' is the blueprint name used internally by Flask
todo_bp = Blueprint('todos', __name__)

@todo_bp.route('/todos', methods=['GET'])
def get_todos():
    """
    GET /api/todos - Retrieve all todos from the database.
    
    This endpoint returns a list of all todos in JSON format. It's the primary
    way for the frontend to load existing todos when the app starts.
    
    Returns:
        JSON response with array of todo objects and 200 status code
        
    Example response:
        {
            "todos": [
                {
                    "id": 1,
                    "title": "Complete assessment",
                    "description": "Build full stack todo app",
                    "completed": false,
                    "created_at": "2025-11-01T12:00:00Z"
                }
            ],
            "count": 1
        }
    """
    # Delegate to controller which handles the business logic
    # Controllers interact with the database and return data or errors
    result = get_all_todos()
    
    # Return the result with appropriate HTTP status code
    # The controller returns a tuple (data, status_code) that we pass through
    return jsonify(result[0]), result[1]

@todo_bp.route('/todos/<int:todo_id>', methods=['GET'])
def get_todo(todo_id):
    """
    GET /api/todos/<id> - Retrieve a specific todo by its ID.
    
    This endpoint is useful when you need detailed information about a single todo,
    though in our app we typically work with the full list. It demonstrates
    RESTful best practices where each resource has a unique URL.
    
    Args:
        todo_id (int): The ID of the todo to retrieve
        
    Returns:
        JSON response with the todo object and 200 status, or error with 404
        
    Example response (success):
        {
            "id": 1,
            "title": "Complete assessment",
            "description": "Build full stack todo app",
            "completed": false,
            "created_at": "2025-11-01T12:00:00Z"
        }
        
    Example response (not found):
        {
            "error": "Todo not found",
            "message": "Todo with ID 1 does not exist"
        }
    """
    result = get_todo_by_id(todo_id)
    return jsonify(result[0]), result[1]

@todo_bp.route('/todos', methods=['POST'])
def create_new_todo():
    """
    POST /api/todos - Create a new todo.
    
    This endpoint accepts JSON data with todo details and creates a new record
    in the database. The frontend calls this when the user submits the add todo form.
    
    Required fields in request body:
        - title (string): The todo title
        
    Optional fields:
        - description (string): Additional details about the todo
        - completed (boolean): Initial completion status (defaults to false)
        
    Returns:
        JSON response with the created todo and 201 status, or error with 400
        
    Example request body:
        {
            "title": "Buy groceries",
            "description": "Milk, eggs, bread",
            "completed": false
        }
        
    Example response (success):
        {
            "message": "Todo created successfully",
            "todo": {
                "id": 2,
                "title": "Buy groceries",
                "description": "Milk, eggs, bread",
                "completed": false,
                "created_at": "2025-11-01T13:00:00Z"
            }
        }
    """
    # request.get_json() parses the JSON body of the request
    # It returns None if the content-type isn't application/json or if parsing fails
    data = request.get_json()
    
    # Validate that we received JSON data
    # This catches cases where the client sends malformed requests
    if not data:
        return jsonify({
            "error": "Invalid request",
            "message": "Request body must be valid JSON"
        }), 400
    
    result = create_todo(data)
    return jsonify(result[0]), result[1]

@todo_bp.route('/todos/<int:todo_id>', methods=['PUT'])
def update_existing_todo(todo_id):
    """
    PUT /api/todos/<id> - Update an existing todo.
    
    This endpoint allows updating any field of a todo. It's used by the frontend
    when editing a todo or toggling its completion status. Following REST conventions,
    PUT updates the entire resource, though we're lenient and only update provided fields.
    
    Args:
        todo_id (int): The ID of the todo to update
        
    Request body can include any of:
        - title (string): New title
        - description (string): New description
        - completed (boolean): New completion status
        
    Returns:
        JSON response with updated todo and 200 status, or error with 400/404
        
    Example request body:
        {
            "completed": true
        }
        
    Example response (success):
        {
            "message": "Todo updated successfully",
            "todo": {
                "id": 1,
                "title": "Complete assessment",
                "description": "Build full stack todo app",
                "completed": true,
                "created_at": "2025-11-01T12:00:00Z"
            }
        }
    """
    data = request.get_json()
    
    if not data:
        return jsonify({
            "error": "Invalid request",
            "message": "Request body must be valid JSON"
        }), 400
    
    result = update_todo(todo_id, data)
    return jsonify(result[0]), result[1]

@todo_bp.route('/todos/<int:todo_id>', methods=['DELETE'])
def delete_existing_todo(todo_id):
    """
    DELETE /api/todos/<id> - Delete a todo.
    
    This endpoint permanently removes a todo from the database. It's called when
    the user clicks the delete button in the frontend. Following REST conventions,
    DELETE is idempotent - deleting the same ID multiple times has the same effect
    as deleting it once (returns 404 after the first deletion).
    
    Args:
        todo_id (int): The ID of the todo to delete
        
    Returns:
        JSON response with success message and 200 status, or error with 404
        
    Example response (success):
        {
            "message": "Todo deleted successfully",
            "id": 1
        }
        
    Example response (not found):
        {
            "error": "Todo not found",
            "message": "Todo with ID 1 does not exist"
        }
    """
    result = delete_todo(todo_id)
    return jsonify(result[0]), result[1]
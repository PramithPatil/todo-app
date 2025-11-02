"""
Business logic for todo operations.

This controller module contains all the business logic for managing todos.
By separating this from routes, we follow the MVC pattern which provides:
- Better testability (can test logic without HTTP layer)
- Cleaner code organization
- Reusability (same logic can be used by different interfaces)

Controllers interact with the database models and return structured responses
with appropriate HTTP status codes.
"""

from models import Todo
from database.connection import db

def get_all_todos():
    """
    Retrieve all todos from the database.
    
    This function queries the database for all todo records and converts them
    to dictionaries for JSON serialization. We're using SQLAlchemy's simple
    query interface which is much cleaner than writing raw SQL.
    
    Returns:
        tuple: (response_dict, status_code)
            - response_dict contains the list of todos and count
            - status_code is 200 for success
            
    Example return value:
        ({
            "todos": [...],
            "count": 5
        }, 200)
    """
    try:
        # Query all todos from the database
        # Todo.query.all() returns a list of Todo model instances
        # We could also use filters here: Todo.query.filter_by(completed=False).all()
        todos = Todo.query.all()
        
        # Convert each Todo object to a dictionary using the to_dict() method
        # List comprehension is Pythonic and efficient for transforming collections
        todos_list = [todo.to_dict() for todo in todos]
        
        # Return both the todos and a count for convenience
        # The count makes it easy for the frontend to show "5 todos" without calculating
        return {
            "todos": todos_list,
            "count": len(todos_list)
        }, 200
        
    except Exception as e:
        # Catch any unexpected errors (database connection issues, etc.)
        # In production, you'd want to log this error to a monitoring service
        print(f"Error fetching todos: {str(e)}")
        return {
            "error": "Internal server error",
            "message": "Failed to fetch todos"
        }, 500

def get_todo_by_id(todo_id):
    """
    Retrieve a specific todo by its ID.
    
    This demonstrates SQLAlchemy's query methods and proper error handling
    for cases where the requested resource doesn't exist.
    
    Args:
        todo_id (int): The ID of the todo to retrieve
        
    Returns:
        tuple: (response_dict, status_code)
            - 200 with todo data if found
            - 404 with error message if not found
    """
    try:
        # get() is shorthand for query.filter_by(id=todo_id).first()
        # It returns the todo object or None if not found
        todo = Todo.query.get(todo_id)
        
        # Check if the todo exists
        # This is important for proper RESTful API behavior - return 404 for missing resources
        if not todo:
            return {
                "error": "Todo not found",
                "message": f"Todo with ID {todo_id} does not exist"
            }, 404
        
        # Return the todo as a dictionary
        return todo.to_dict(), 200
        
    except Exception as e:
        print(f"Error fetching todo {todo_id}: {str(e)}")
        return {
            "error": "Internal server error",
            "message": "Failed to fetch todo"
        }, 500

def create_todo(data):
    """
    Create a new todo with the provided data.
    
    This function handles validation, object creation, and database persistence.
    We're being defensive with validation to ensure data integrity and provide
    clear error messages when the client sends invalid requests.
    
    Args:
        data (dict): Dictionary containing todo data from the request
        
    Returns:
        tuple: (response_dict, status_code)
            - 201 with created todo if successful
            - 400 with error message if validation fails
            
    Required fields in data:
        - title: Must be a non-empty string
        
    Optional fields:
        - description: String (can be empty or None)
        - completed: Boolean (defaults to False)
    """
    try:
        # Validate required field: title
        # We check both existence and non-empty after stripping whitespace
        # This prevents creating todos with titles like "   " which are technically strings
        title = data.get('title', '').strip()
        if not title:
            return {
                "error": "Validation error",
                "message": "Title is required and cannot be empty"
            }, 400
        
        # Additional validation: title length
        # We enforce the 200 character limit defined in the model
        # Catching this here provides a better error message than a database error
        if len(title) > 200:
            return {
                "error": "Validation error",
                "message": "Title must be 200 characters or less"
            }, 400
        
        # Extract optional fields with sensible defaults
        # get() returns None if the key doesn't exist, which is fine for description
        # For completed, we default to False to match expected todo behavior
        description = data.get('description', '').strip() or None
        completed = data.get('completed', False)
        
        # Validate completed is actually a boolean
        # This prevents weird values like "yes" or 1 being treated as booleans
        if not isinstance(completed, bool):
            return {
                "error": "Validation error",
                "message": "Completed must be a boolean (true or false)"
            }, 400
        
        # Create a new Todo instance
        # The created_at field will be automatically set by SQLAlchemy using our default
        new_todo = Todo(
            title=title,
            description=description,
            completed=completed
        )
        
        # Add the new todo to the database session
        # SQLAlchemy uses a session to batch database operations for efficiency
        db.session.add(new_todo)
        
        # Commit the transaction to persist changes to the database
        # This is when the INSERT SQL statement actually executes
        # If this fails (database connection issue, constraint violation, etc.),
        # an exception will be raised and caught by our except block
        db.session.commit()
        
        # Return success response with the created todo
        # Status code 201 specifically means "Created" in REST conventions
        return {
            "message": "Todo created successfully",
            "todo": new_todo.to_dict()
        }, 201
        
    except Exception as e:
        # Rollback the session if something went wrong
        # This ensures the database stays in a consistent state
        db.session.rollback()
        print(f"Error creating todo: {str(e)}")
        return {
            "error": "Internal server error",
            "message": "Failed to create todo"
        }, 500

def update_todo(todo_id, data):
    """
    Update an existing todo with new data.
    
    This function finds the todo, validates the update data, applies changes,
    and saves to the database. We only update fields that are provided in the
    request, leaving others unchanged.
    
    Args:
        todo_id (int): ID of the todo to update
        data (dict): Dictionary with fields to update
        
    Returns:
        tuple: (response_dict, status_code)
            - 200 with updated todo if successful
            - 400 if validation fails
            - 404 if todo not found
    """
    try:
        # Find the todo to update
        todo = Todo.query.get(todo_id)
        
        if not todo:
            return {
                "error": "Todo not found",
                "message": f"Todo with ID {todo_id} does not exist"
            }, 404
        
        # Validate and update title if provided
        # We allow partial updates, so title is optional in update requests
        if 'title' in data:
            title = data['title'].strip()
            if not title:
                return {
                    "error": "Validation error",
                    "message": "Title cannot be empty"
                }, 400
            if len(title) > 200:
                return {
                    "error": "Validation error",
                    "message": "Title must be 200 characters or less"
                }, 400
            todo.title = title
        
        # Update description if provided
        # Empty strings are converted to None for consistency
        if 'description' in data:
            description = data['description'].strip() if data['description'] else None
            todo.description = description
        
        # Update completed status if provided
        if 'completed' in data:
            completed = data['completed']
            if not isinstance(completed, bool):
                return {
                    "error": "Validation error",
                    "message": "Completed must be a boolean"
                }, 400
            todo.completed = completed
        
        # Commit the changes to the database
        # Since we modified an existing object, we don't need to call add()
        # SQLAlchemy tracks changes to objects in the session automatically
        db.session.commit()
        
        return {
            "message": "Todo updated successfully",
            "todo": todo.to_dict()
        }, 200
        
    except Exception as e:
        db.session.rollback()
        print(f"Error updating todo {todo_id}: {str(e)}")
        return {
            "error": "Internal server error",
            "message": "Failed to update todo"
        }, 500

def delete_todo(todo_id):
    """
    Delete a todo from the database.
    
    This permanently removes the todo. In a production app with user accounts,
    you might implement soft deletes (marking as deleted instead of removing)
    to enable "undo" functionality or maintain audit trails.
    
    Args:
        todo_id (int): ID of the todo to delete
        
    Returns:
        tuple: (response_dict, status_code)
            - 200 with success message if deleted
            - 404 if todo not found
    """
    try:
        # Find the todo to delete
        todo = Todo.query.get(todo_id)
        
        if not todo:
            return {
                "error": "Todo not found",
                "message": f"Todo with ID {todo_id} does not exist"
            }, 404
        
        # Delete the todo from the database
        # This removes the row from the todos table
        db.session.delete(todo)
        db.session.commit()
        
        return {
            "message": "Todo deleted successfully",
            "id": todo_id
        }, 200
        
    except Exception as e:
        db.session.rollback()
        print(f"Error deleting todo {todo_id}: {str(e)}")
        return {
            "error": "Internal server error",
            "message": "Failed to delete todo"
        }, 500
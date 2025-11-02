"""
Database models for the Todo application.

This module defines the structure of our Todo entity using SQLAlchemy ORM.
ORM (Object-Relational Mapping) allows us to work with database records as
Python objects, making code more intuitive and reducing SQL errors.

The Todo model represents a single task with all necessary fields for a
complete todo management system.
"""

from database.connection import db
from datetime import datetime

class Todo(db.Model):
    """
    Todo model representing a task in the database.
    
    This class maps to a 'todos' table in the database. Each instance represents
    a single todo item with fields for tracking its title, description, completion
    status, and creation timestamp.
    
    Using SQLAlchemy's declarative base gives us automatic table creation,
    query methods, and relationship handling without writing raw SQL.
    """
    
    # Define the table name explicitly for clarity
    # SQLAlchemy would auto-generate 'todo' but we prefer the plural form
    __tablename__ = 'todos'
    
    # Primary key: Auto-incrementing integer ID
    # Every todo needs a unique identifier for CRUD operations
    # autoincrement=True ensures each new todo gets the next available ID
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    
    # Title field: Required short description of the todo
    # nullable=False ensures data integrity - every todo must have a title
    # We're limiting to 200 characters to encourage concise task descriptions
    title = db.Column(db.String(200), nullable=False)
    
    # Description field: Optional detailed information about the todo
    # This can be left empty for simple tasks, hence nullable=True
    # db.Text allows for longer content compared to db.String
    description = db.Column(db.Text, nullable=True)
    
    # Completion status: Boolean flag to track if the todo is done
    # default=False means new todos start as incomplete
    # This makes the API behavior intuitive - you create a todo to work on it
    completed = db.Column(db.Boolean, default=False, nullable=False)
    
    # Creation timestamp: Automatically set when the todo is created
    # datetime.utcnow is a function reference (not called with ()) so it's
    # evaluated at insertion time, not at model definition time
    # Using UTC avoids timezone confusion and is a best practice for APIs
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
    
    def to_dict(self):
        """
        Convert the Todo object to a dictionary for JSON serialization.
        
        This method is crucial for our API responses. SQLAlchemy model instances
        can't be directly converted to JSON, so we manually create a dictionary
        with all the fields we want to expose in our API.
        
        We're formatting the created_at timestamp as ISO 8601 string because:
        1. It's a widely accepted standard for datetime in APIs
        2. JavaScript's Date object can parse it directly
        3. It's human-readable for debugging
        
        Returns:
            dict: Dictionary representation of the todo with all fields
        """
        return {
            'id': self.id,
            'title': self.title,
            'description': self.description,
            'completed': self.completed,
            # isoformat() converts datetime to string like "2025-11-01T12:00:00"
            # Adding 'Z' indicates UTC timezone for API consumers
            'created_at': self.created_at.isoformat() + 'Z' if self.created_at else None
        }
    
    def __repr__(self):
        """
        String representation of the Todo object for debugging.
        
        This makes it easier to identify todos in logs and during development.
        When you print a Todo object, you'll see something like:
        <Todo 1: Complete assessment>
        
        Returns:
            str: A readable representation of the todo
        """
        return f'<Todo {self.id}: {self.title}>'
    
    def update(self, **kwargs):
        """
        Update the todo with provided keyword arguments.
        
        This is a convenience method that makes updating todos cleaner in the controller.
        Instead of manually setting each field, we can pass a dictionary and update
        all fields at once, but only the ones that are provided.
        
        We're explicitly checking for keys to avoid accidentally setting fields
        to None if they're not included in the update data.
        
        Args:
            **kwargs: Arbitrary keyword arguments for fields to update
        """
        # Only update fields that are actually provided in the request
        # This prevents accidentally clearing fields that weren't meant to be changed
        if 'title' in kwargs:
            self.title = kwargs['title']
        if 'description' in kwargs:
            self.description = kwargs['description']
        if 'completed' in kwargs:
            self.completed = kwargs['completed']
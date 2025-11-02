/**
 * TodoItem component representing a single todo in the list.
 * 
 * This component is the heart of our todo UI. It displays all the todo information
 * and provides interactive controls for completing, editing, and deleting todos.
 * 
 * We're using careful attention to UX details like hover effects, smooth animations,
 * and clear visual feedback to make the interface feel polished and professional.
 */

import React from 'react';

/**
 * TodoItem functional component.
 * 
 * This component renders a single todo with all its interactive elements.
 * It's a controlled component that receives all its data and behavior from props,
 * making it predictable and easy to test.
 * 
 * @param {Object} props - Component props
 * @param {Object} props.todo - The todo object to display
 * @param {Function} props.onToggle - Handler for toggling completion status
 * @param {Function} props.onEdit - Handler for editing the todo
 * @param {Function} props.onDelete - Handler for deleting the todo
 */
function TodoItem({ todo, onToggle, onEdit, onDelete }) {
  /**
   * Format the creation date for display.
   * 
   * We're converting the ISO timestamp from the backend into a human-readable
   * format. This helps users understand when they created each todo, which is
   * useful for prioritization and context.
   * 
   * We're using Intl.DateTimeFormat for localization - it automatically formats
   * dates according to the user's locale and preferences.
   */
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    
    // Format as "Nov 1, 2025" or equivalent in user's locale
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }).format(date);
  };
  
  /**
   * Handle the delete button click with confirmation.
   * 
   * We use a native confirm dialog to prevent accidental deletions.
   * In a more polished app, you might use a custom modal for better styling,
   * but this provides good UX with zero additional dependencies.
   */
  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this todo?')) {
      onDelete(todo.id);
    }
  };
  
  return (
    <div className={`todo-item ${todo.completed ? 'completed' : ''}`}>
      {/* Checkbox for toggling completion status */}
      <div className="todo-checkbox-wrapper">
        <input
          type="checkbox"
          className="todo-checkbox"
          checked={todo.completed}
          onChange={() => onToggle(todo.id)}
          id={`todo-${todo.id}`}
        />
        {/* Custom checkbox label for better styling control */}
        <label 
          htmlFor={`todo-${todo.id}`} 
          className="todo-checkbox-label"
        ></label>
      </div>
      
      {/* Todo content section */}
      <div className="todo-content">
        {/* Title with conditional strikethrough for completed todos */}
        <h3 className="todo-title">
          {todo.title}
        </h3>
        
        {/* Description - only show if it exists */}
        {/* This conditional rendering keeps the UI clean for todos without descriptions */}
        {todo.description && (
          <p className="todo-description">{todo.description}</p>
        )}
        
        {/* Metadata bar with creation date */}
        <div className="todo-meta">
          <span className="todo-date">
            📅 {formatDate(todo.created_at)}
          </span>
          
          {/* Completion badge */}
          {todo.completed && (
            <span className="todo-badge">
              ✓ Completed
            </span>
          )}
        </div>
      </div>
      
      {/* Action buttons section */}
      {/* We're using button elements instead of divs for accessibility */}
      <div className="todo-actions">
        <button
          className="btn-icon btn-edit"
          onClick={() => onEdit(todo)}
          title="Edit todo"
          aria-label="Edit todo"
        >
          ✏️
        </button>
        
        <button
          className="btn-icon btn-delete"
          onClick={handleDelete}
          title="Delete todo"
          aria-label="Delete todo"
        >
          🗑️
        </button>
      </div>
    </div>
  );
}

export default TodoItem;
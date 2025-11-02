/**
 * AddTodoForm component for creating new todos.
 * 
 * This component manages its own form state using useState, demonstrating
 * controlled components in React. In controlled components, form data is
 * stored in React state rather than the DOM, giving us full control over
 * the form behavior and validation.
 * 
 * We're using a simple, focused design that encourages quick task entry
 * while still allowing for detailed descriptions when needed.
 */

import React, { useState } from 'react';

/**
 * AddTodoForm functional component.
 * 
 * This component handles user input for creating new todos. It manages
 * form state locally and calls the parent's onAddTodo function when submitted.
 * 
 * @param {Object} props - Component props
 * @param {Function} props.onAddTodo - Callback function to create a new todo
 */
function AddTodoForm({ onAddTodo }) {
  // Local state for form inputs
  // We use separate state variables for each input for clarity and independence
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  
  // State to track form submission status
  // This prevents double-submissions and provides loading feedback
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  /**
   * Handle form submission.
   * 
   * This function validates the input, calls the parent's onAddTodo callback,
   * and resets the form. Using async/await makes the asynchronous flow clear
   * and easy to follow.
   * 
   * @param {Event} e - The form submit event
   */
  const handleSubmit = async (e) => {
    // Prevent default form submission which would reload the page
    // This is crucial for SPA (Single Page Application) behavior
    e.preventDefault();
    
    // Validate that title is not empty or just whitespace
    // trim() removes leading/trailing spaces, so "   " becomes ""
    const trimmedTitle = title.trim();
    if (!trimmedTitle) {
      // Could show an error message here in a more polished app
      return;
    }
    
    // Prevent multiple simultaneous submissions
    // This is important for preventing duplicate todos if user clicks rapidly
    if (isSubmitting) return;
    
    try {
      setIsSubmitting(true);
      
      // Call the parent's callback with the new todo data
      // We only send non-empty description to keep the API payload clean
      await onAddTodo({
        title: trimmedTitle,
        description: description.trim() || undefined,
        completed: false
      });
      
      // Clear the form after successful submission
      // This provides clear feedback that the todo was created
      setTitle('');
      setDescription('');
    } catch (error) {
      // Error is handled by parent component, but we could show
      // form-specific error messages here if needed
      console.error('Form submission error:', error);
    } finally {
      // Always reset submitting state, even if there was an error
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="add-todo-section">
      <h2 className="section-title">Add New Todo</h2>
      
      <form onSubmit={handleSubmit} className="add-todo-form">
        {/* Title input - the main task description */}
        <div className="form-group">
          <input
            type="text"
            className="form-input"
            placeholder="What needs to be done?"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            disabled={isSubmitting}
            maxLength={200} // Match backend validation
            required
          />
        </div>
        
        {/* Description input - optional additional details */}
        <div className="form-group">
          <textarea
            className="form-textarea"
            placeholder="Add a description (optional)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            disabled={isSubmitting}
            rows={3}
          />
        </div>
        
        {/* Submit button with loading state */}
        <button
          type="submit"
          className="btn btn-primary"
          disabled={isSubmitting || !title.trim()}
        >
          {isSubmitting ? (
            <>
              <span className="btn-spinner"></span>
              Adding...
            </>
          ) : (
            <>
              <span>+</span>
              Add Todo
            </>
          )}
        </button>
      </form>
    </div>
  );
}

export default AddTodoForm;
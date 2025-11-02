/**
 * Main App Component - Todo Application
 * 
 * This is the root component that manages the entire todo application state and behavior.
 * We're using React Hooks (useState, useEffect) for state management, which is the modern
 * approach and simpler than class components.
 * 
 * Key Features:
 * - Full CRUD operations (Create, Read, Update, Delete)
 * - Edit modal for modifying todos
 * - Progress bar showing completion percentage
 * - Real-time UI updates with optimistic rendering
 * - Comprehensive error handling and user feedback
 * 
 * Architecture: This component follows the "Smart Component" pattern where it manages
 * all state and business logic, making it the single source of truth for todo data.
 */

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './styles/App.css';

function App() {
  // ============================================
  // STATE MANAGEMENT
  // ============================================
  
  /**
   * Main todo list state
   * Stores all todos fetched from the backend. Using an array allows us to easily
   * map over todos to render them, filter completed/active todos, and update specific items.
   */
  const [todos, setTodos] = useState([]);
  
  /**
   * Form state for adding new todos
   * Separating these into individual state variables (rather than one object) makes
   * the code more readable and follows React best practices for form handling.
   */
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  
  /**
   * UI state for loading, errors, and success messages
   * These provide visual feedback to users about the app's status.
   */
  const [loading, setLoading] = useState(true); // Shows spinner while fetching initial data
  const [error, setError] = useState(null); // Displays error messages when operations fail
  const [successMessage, setSuccessMessage] = useState(''); // Shows success confirmations
  
  /**
   * Edit modal state
   * When editingTodo is not null, the modal will be displayed. We store the todo being
   * edited plus separate state for the form fields to allow users to cancel without
   * affecting the original todo data.
   */
  const [editingTodo, setEditingTodo] = useState(null); // The todo object being edited
  const [editTitle, setEditTitle] = useState(''); // Temporary title while editing
  const [editDescription, setEditDescription] = useState(''); // Temporary description
  const [editCompleted, setEditCompleted] = useState(false); // Temporary completion status

  // ============================================
  // LIFECYCLE EFFECTS
  // ============================================
  
  /**
   * Fetch todos on component mount
   * 
   * useEffect with an empty dependency array [] runs only once when the component
   * first mounts, similar to componentDidMount in class components. This is the
   * perfect place to load initial data from the backend.
   */
  useEffect(() => {
    fetchTodos();
  }, []); // Empty array means "run once on mount"

  // ============================================
  // API FUNCTIONS
  // ============================================
  
  /**
   * Fetch all todos from the backend API
   * 
   * This function is called on mount and can be called again to refresh the todo list.
   * We use async/await for cleaner asynchronous code compared to promise chains.
   * 
   * Error Handling: We catch any errors and set the error state to show users a
   * friendly message instead of letting the app crash.
   */
  const fetchTodos = async () => {
    try {
      setLoading(true); // Show loading spinner
      setError(null); // Clear any previous errors
      
      // Use environment variable for API URL, with localhost fallback for development
      // This allows different URLs for development, staging, and production without code changes
      const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
      
      // Make GET request to fetch all todos
      const response = await axios.get(`${API_URL}/todos`);
      
      // Update state with fetched todos
      // response.data.todos is the array of todo objects from the backend
      setTodos(response.data.todos);
      
      setLoading(false); // Hide loading spinner
    } catch (err) {
      // If anything goes wrong (network error, backend down, etc.), show error message
      console.error('Error fetching todos:', err);
      setError('Failed to load todos. Please check your connection and try again.');
      setLoading(false);
    }
  };

  /**
   * Add a new todo
   * 
   * This function is called when the user submits the "Add Todo" form. We validate
   * the input, send it to the backend, and optimistically update the UI.
   * 
   * @param {Event} e - Form submit event
   */
  const addTodo = async (e) => {
    // Prevent default form submission which would reload the page
    // This is crucial for Single Page Applications (SPAs)
    e.preventDefault();
    
    // Validation: Don't allow empty titles
    // trim() removes whitespace, so "   " becomes "" and fails validation
    if (!title.trim()) return;
    
    try {
      const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
      
      // Send POST request to create new todo
      // The backend will generate the ID and timestamp
      const response = await axios.post(`${API_URL}/todos`, {
        title: title.trim(), // Remove leading/trailing whitespace
        description: description.trim() || undefined, // Send undefined if empty
        completed: false // New todos start as incomplete
      });
      
      // Add the new todo to the beginning of the array using spread operator
      // [newTodo, ...oldTodos] creates a new array with new todo first
      // This triggers a re-render and shows the new todo at the top
      setTodos([response.data.todo, ...todos]);
      
      // Clear the form fields after successful creation
      // This provides clear feedback that the todo was added
      setTitle('');
      setDescription('');
      
      // Show success message
      showSuccess('Todo created successfully!');
    } catch (err) {
      console.error('Error creating todo:', err);
      setError('Failed to create todo. Please try again.');
    }
  };

  /**
   * Toggle a todo's completion status
   * 
   * This is called when the user clicks the checkbox. We use optimistic updates,
   * meaning we update the UI immediately before the backend confirms, making the
   * app feel faster and more responsive.
   * 
   * @param {number} id - The ID of the todo to toggle
   */
  const toggleTodo = async (id) => {
    // Find the todo we're toggling
    const todo = todos.find(t => t.id === id);
    if (!todo) return; // Safety check in case todo doesn't exist

    try {
      const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
      
      // Optimistically update the UI before the backend responds
      // This makes the app feel instant. If the request fails, we could revert this change
      setTodos(todos.map(t => 
        t.id === id ? { ...t, completed: !t.completed } : t
      ));
      
      // Send update request to backend
      // We only send the field we're changing (completed) to minimize data transfer
      await axios.put(`${API_URL}/todos/${id}`, {
        completed: !todo.completed
      });
      
      // Show appropriate success message based on the action
      showSuccess(
        todo.completed 
          ? 'Todo marked as incomplete' 
          : 'Todo marked as complete!'
      );
    } catch (err) {
      console.error('Error toggling todo:', err);
      
      // Revert the optimistic update if the request failed
      // This ensures the UI stays in sync with the backend
      setTodos(todos.map(t => 
        t.id === id ? { ...t, completed: todo.completed } : t
      ));
      
      setError('Failed to update todo. Please try again.');
    }
  };

  /**
   * Open the edit modal for a specific todo
   * 
   * This populates the edit form with the todo's current values and displays the modal.
   * By storing the values in separate state variables, users can make changes without
   * affecting the original todo until they click "Save".
   * 
   * @param {Object} todo - The todo object to edit
   */
  const openEditModal = (todo) => {
    setEditingTodo(todo); // Mark this todo as being edited
    setEditTitle(todo.title); // Pre-fill the title field
    setEditDescription(todo.description || ''); // Pre-fill description (default to empty string)
    setEditCompleted(todo.completed); // Pre-fill completion status
  };

  /**
   * Close the edit modal without saving
   * 
   * This resets all edit-related state, effectively discarding any changes the user made.
   * It's called when the user clicks "Cancel", presses ESC, or clicks outside the modal.
   */
  const closeEditModal = () => {
    setEditingTodo(null);
    setEditTitle('');
    setEditDescription('');
    setEditCompleted(false);
  };

  /**
   * Save changes from the edit modal
   * 
   * This sends the updated todo data to the backend and updates the local state.
   * 
   * @param {Event} e - Form submit event
   */
  const saveEdit = async (e) => {
    e.preventDefault(); // Prevent form submission from reloading the page
    
    // Validation: Don't allow empty titles
    if (!editTitle.trim() || !editingTodo) return;

    try {
      const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
      
      // Send PUT request with updated data
      const response = await axios.put(`${API_URL}/todos/${editingTodo.id}`, {
        title: editTitle.trim(),
        description: editDescription.trim() || undefined,
        completed: editCompleted
      });
      
      // Update the todo in our local state
      // map() creates a new array, replacing the edited todo with the updated version
      setTodos(todos.map(t => 
        t.id === editingTodo.id ? response.data.todo : t
      ));
      
      closeEditModal(); // Close the modal after successful save
      showSuccess('Todo updated successfully!');
    } catch (err) {
      console.error('Error updating todo:', err);
      setError('Failed to update todo. Please try again.');
    }
  };

  /**
   * Delete a todo
   * 
   * This removes a todo from both the backend and frontend. We show a confirmation
   * dialog to prevent accidental deletions, which is important for destructive actions.
   * 
   * @param {number} id - The ID of the todo to delete
   */
  const deleteTodo = async (id) => {
    // Show confirmation dialog before deleting
    // This prevents accidental data loss and is a UX best practice
    if (!window.confirm('Are you sure you want to delete this todo?')) return;
    
    try {
      const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
      
      // Optimistically remove from UI immediately
      setTodos(todos.filter(t => t.id !== id));
      
      // Send DELETE request to backend
      await axios.delete(`${API_URL}/todos/${id}`);
      
      showSuccess('Todo deleted successfully!');
    } catch (err) {
      console.error('Error deleting todo:', err);
      setError('Failed to delete todo. Please try again.');
      
      // In case of error, refetch todos to restore the deleted item
      fetchTodos();
    }
  };

  // ============================================
  // UTILITY FUNCTIONS
  // ============================================

  /**
   * Show a temporary success message
   * 
   * This displays a green success message that automatically disappears after 3 seconds.
   * Using setTimeout ensures the message doesn't stay on screen forever.
   * 
   * @param {string} message - The success message to display
   */
  const showSuccess = (message) => {
    setSuccessMessage(message);
    
    // Automatically clear the message after 3 seconds
    // setTimeout returns an ID that could be used to cancel the timeout if needed
    setTimeout(() => {
      setSuccessMessage('');
    }, 3000);
  };

  // ============================================
  // COMPUTED VALUES
  // ============================================
  
  /**
   * Calculate statistics for display
   * 
   * These values are computed on every render, but that's fine since the calculations
   * are very fast. For more complex calculations, we could use React.useMemo() to
   * optimize performance by caching the results.
   */
  const completedCount = todos.filter(t => t.completed).length;
  const activeCount = todos.length - completedCount;
  
  // Calculate progress percentage for the progress bar
  // We handle the edge case where there are no todos to avoid division by zero
  const progressPercentage = todos.length > 0 
    ? Math.round((completedCount / todos.length) * 100) 
    : 0;

  // ============================================
  // RENDER
  // ============================================

  return (
    <div className="app">
      <div className="container">
        {/* 
          HEADER SECTION
          Shows app title and statistics cards
        */}
        <header className="header">
          <div className="header-title">
            <h1>
              <span className="header-icon">✓</span>
              Todo App
            </h1>
            <p className="header-subtitle">Stay organized and productive</p>
          </div>
          
          {/* 
            Statistics cards showing todo counts
            These update automatically as todos change
          */}
          <div className="stats">
            <div className="stat-card">
              <div className="stat-value">{todos.length}</div>
              <div className="stat-label">Total</div>
            </div>
            <div className="stat-card stat-card-active">
              <div className="stat-value">{activeCount}</div>
              <div className="stat-label">Active</div>
            </div>
            <div className="stat-card stat-card-completed">
              <div className="stat-value">{completedCount}</div>
              <div className="stat-label">Completed</div>
            </div>
          </div>
        </header>

        {/* 
          ERROR MESSAGE
          Only rendered when error state is not null
          Conditional rendering using && operator
        */}
        {error && (
          <div className="error-message">
            <span>⚠️ {error}</span>
            <button onClick={() => setError(null)} aria-label="Dismiss error">✕</button>
          </div>
        )}

        {/* 
          SUCCESS MESSAGE
          Automatically disappears after 3 seconds
        */}
        {successMessage && (
          <div className="success-message">
            <span>✓ {successMessage}</span>
          </div>
        )}

        {/* 
          ADD TODO FORM SECTION
          Controlled form components - React manages the input values
        */}
        <div className="add-todo-section">
          <h2 className="section-title">Add New Todo</h2>
          <form onSubmit={addTodo} className="add-todo-form">
            {/* Title input - required field */}
            <div className="form-group">
              <input
                type="text"
                className="form-input"
                placeholder="What needs to be done?"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                maxLength={200} // Match backend validation limit
                aria-label="Todo title"
              />
            </div>
            
            {/* Description textarea - optional field */}
            <div className="form-group">
              <textarea
                className="form-textarea"
                placeholder="Add a description (optional)"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                aria-label="Todo description"
              />
            </div>
            
            {/* Submit button */}
            <button type="submit" className="btn btn-primary">
              <span>+</span>
              Add Todo
            </button>
          </form>
        </div>

        {/* 
          CONDITIONAL RENDERING OF TODO LIST
          Three possible states: loading, empty, or showing todos
        */}
        {loading ? (
          // Loading state - shown while fetching initial data
          <div className="loading">
            <div className="spinner"></div>
            <p>Loading todos...</p>
          </div>
        ) : todos.length === 0 ? (
          // Empty state - shown when there are no todos
          <div className="empty-state">
            <div className="empty-state-icon">📝</div>
            <h3>No todos yet</h3>
            <p>Add your first todo to get started!</p>
          </div>
        ) : (
          // Todo list - shown when there are todos to display
          <div className="todo-list-section">
            <h2 className="section-title">
              Your Todos
              <span className="todo-count">{todos.length}</span>
            </h2>

            {/* 
              PROGRESS BAR
              Shows visual representation of completion progress
            */}
            <div className="progress-container">
              <div className="progress-header">
                <span className="progress-label">
                  <span className="progress-icon">✓</span>
                  Progress
                </span>
                <span className="progress-text">
                  {completedCount} of {todos.length} completed
                </span>
              </div>
              <div className="progress-bar">
                {/* 
                  Progress fill - width is set dynamically based on completion percentage
                  Using inline styles for dynamic values that change based on state
                */}
                <div 
                  className="progress-fill" 
                  style={{ width: `${progressPercentage}%` }}
                >
                  {/* Only show percentage text if there's some progress */}
                  {progressPercentage > 0 && (
                    <span className="progress-percentage">{progressPercentage}%</span>
                  )}
                </div>
              </div>
            </div>

            {/* 
              TODO LIST
              Map over todos array to create a TodoItem for each one
              Key prop is essential for React's reconciliation algorithm
            */}
            <div className="todo-list">
              {todos.map((todo) => (
                <div 
                  key={todo.id} 
                  className={`todo-item ${todo.completed ? 'completed' : ''}`}
                >
                  {/* 
                    CHECKBOX for toggling completion
                    Using htmlFor and id to make label clickable
                  */}
                  <div className="todo-checkbox-wrapper">
                    <input
                      type="checkbox"
                      className="todo-checkbox"
                      checked={todo.completed}
                      onChange={() => toggleTodo(todo.id)}
                      id={`todo-${todo.id}`}
                      aria-label={`Mark "${todo.title}" as ${todo.completed ? 'incomplete' : 'complete'}`}
                    />
                    <label 
                      htmlFor={`todo-${todo.id}`} 
                      className="todo-checkbox-label"
                    ></label>
                  </div>
                  
                  {/* 
                    TODO CONTENT
                    Title, description, and metadata
                  */}
                  <div className="todo-content">
                    <h3 className="todo-title">{todo.title}</h3>
                    
                    {/* Only show description if it exists */}
                    {todo.description && (
                      <p className="todo-description">{todo.description}</p>
                    )}
                    
                    <div className="todo-meta">
                      {/* 
                        Format the creation date using toLocaleDateString
                        This provides localized date formatting
                      */}
                      <span className="todo-date">
                        📅 Created: {new Date(todo.created_at).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                      
                      {/* Show completed badge only for completed todos */}
                      {todo.completed && (
                        <span className="todo-badge">✓ Completed</span>
                      )}
                    </div>
                  </div>
                  
                  {/* 
                    ACTION BUTTONS
                    Edit and delete functionality
                  */}
                  <div className="todo-actions">
                    <button
                      className="btn-icon btn-edit"
                      onClick={() => openEditModal(todo)}
                      title="Edit todo"
                      aria-label={`Edit "${todo.title}"`}
                    >
                      ✏️
                    </button>
                    <button
                      className="btn-icon btn-delete"
                      onClick={() => deleteTodo(todo.id)}
                      title="Delete todo"
                      aria-label={`Delete "${todo.title}"`}
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 
          EDIT MODAL
          Only rendered when editingTodo is not null
          Modal overlays the main content for focused editing
        */}
        {editingTodo && (
          <div 
            className="modal-backdrop" 
            onClick={(e) => {
              // Close modal if user clicks the backdrop (outside the modal)
              // We check if the click target is the backdrop itself, not a child
              if (e.target.className === 'modal-backdrop') {
                closeEditModal();
              }
            }}
          >
            <div className="modal" onClick={(e) => e.stopPropagation()}>
              {/* 
                MODAL HEADER
                Title and close button
              */}
              <div className="modal-header">
                <h2>Edit Todo</h2>
                <button
                  className="modal-close"
                  onClick={closeEditModal}
                  aria-label="Close modal"
                  type="button"
                >
                  ✕
                </button>
              </div>
              
              {/* 
                MODAL BODY - EDIT FORM
                Similar to add form but pre-filled with existing values
              */}
              <form onSubmit={saveEdit} className="modal-body">
                {/* Title input */}
                <div className="form-group">
                  <label htmlFor="edit-title" className="form-label">
                    Title *
                  </label>
                  <input
                    type="text"
                    id="edit-title"
                    className="form-input"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    maxLength={200}
                    required
                    autoFocus // Automatically focus on open for better UX
                  />
                </div>
                
                {/* Description textarea */}
                <div className="form-group">
                  <label htmlFor="edit-description" className="form-label">
                    Description
                  </label>
                  <textarea
                    id="edit-description"
                    className="form-textarea"
                    value={editDescription}
                    onChange={(e) => setEditDescription(e.target.value)}
                    rows={4}
                  />
                </div>
                
                {/* Completion status checkbox */}
                <div className="form-group">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={editCompleted}
                      onChange={(e) => setEditCompleted(e.target.checked)}
                    />
                    <span>Mark as completed</span>
                  </label>
                </div>
                
                {/* 
                  MODAL FOOTER - ACTION BUTTONS
                  Cancel and Save buttons
                */}
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={closeEditModal}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Export the component as the default export
// This allows other files to import it as: import App from './App'
export default App;
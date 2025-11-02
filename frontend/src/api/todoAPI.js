/**
 * API Service Layer for Todo Operations
 * 
 * This module serves as the centralized communication layer between the React frontend
 * and the Flask backend API. By isolating all API calls in one place, we achieve:
 * 
 * 1. Separation of Concerns - Components don't need to know about API details
 * 2. Reusability - API functions can be called from any component
 * 3. Maintainability - Easy to update API logic without touching components
 * 4. Testability - Can mock this entire module for testing
 * 5. Error Handling - Consistent error handling across all API calls
 * 
 * Fixed for production deployment with proper error logging and timeout handling.
 */

import axios from 'axios';

// ============================================
// API CONFIGURATION
// ============================================

/**
 * Base URL for all API requests
 * 
 * This uses environment variables to allow different API URLs for different environments:
 * - Production: Uses REACT_APP_API_URL from Vercel environment variables
 * - Development: Falls back to localhost:5000 for local testing
 * 
 * Environment variables in React MUST start with REACT_APP_ to be accessible.
 * They're injected at build time, not runtime, so changes require a rebuild.
 * 
 * Example values:
 * - Production: "https://todo-backend.onrender.com/api"
 * - Development: "http://localhost:5000/api"
 */
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

/**
 * Debug logging for API URL
 * 
 * This console.log helps developers verify which API URL is being used.
 * Useful for debugging deployment issues where the wrong API might be called.
 * 
 * In production, you might want to remove this or use a proper logging service
 * like LogRocket or Sentry for better debugging without cluttering the console.
 */
console.log('🔗 Connecting to API:', API_BASE_URL);

/**
 * Create a configured Axios instance
 * 
 * Instead of using axios directly, we create an instance with default configuration.
 * This provides several benefits:
 * 
 * 1. DRY Principle - Don't repeat baseURL and headers in every request
 * 2. Consistent Configuration - All requests use the same settings
 * 3. Easy to Add Interceptors - Can add request/response interceptors later
 * 4. Timeout Protection - Prevents requests from hanging forever
 * 
 * baseURL: Prepended to all relative URLs in requests
 * headers: Default headers sent with every request
 * timeout: Maximum time (ms) to wait for a response before aborting
 */
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json', // Tell server we're sending JSON
  },
  timeout: 10000, // 10 second timeout - prevents infinite waiting
});

// ============================================
// API FUNCTIONS
// ============================================

/**
 * Fetch all todos from the backend
 * 
 * This function retrieves the complete list of todos. It's called when:
 * - The app first loads (useEffect on mount)
 * - User manually refreshes the todo list
 * - After operations that might affect multiple todos
 * 
 * The function uses try-catch for error handling, which is crucial for:
 * - Preventing app crashes from network errors
 * - Providing user-friendly error messages
 * - Logging detailed error info for debugging
 * 
 * @returns {Promise<Array>} Array of todo objects from the backend
 * @throws {Error} If the request fails or backend returns an error
 * 
 * @example
 * const todos = await getAllTodos();
 * console.log(todos); // [{id: 1, title: "Buy milk", ...}, ...]
 */
export const getAllTodos = async () => {
  try {
    // Log the request for debugging purposes
    // This helps developers see exactly what URL is being called
    console.log('📡 Fetching todos from:', `${API_BASE_URL}/todos`);
    
    // Make GET request to /todos endpoint
    // api.get() automatically:
    // - Adds the baseURL prefix
    // - Sets Content-Type header
    // - Parses JSON response
    // - Throws error for non-2xx status codes
    const response = await api.get('/todos');
    
    // Log successful response for debugging
    // In production, consider using a logging service instead
    console.log('✅ Todos fetched successfully:', response.data);
    
    // Extract and return just the todos array from the response
    // Backend returns: { todos: [...], count: N }
    // We only need the todos array for the component
    return response.data.todos;
    
  } catch (error) {
    // Comprehensive error logging for debugging
    // These logs help identify whether the error is:
    // - Network error (can't reach server)
    // - Server error (500)
    // - Client error (404, 400)
    // - CORS error
    console.error('❌ Error fetching todos:', error);
    console.error('URL was:', `${API_BASE_URL}/todos`);
    
    // If we got a response from the server (even if error), log details
    // error.response exists when server responded with an error status
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
    
    // Throw a user-friendly error message
    // The component will catch this and display it to the user
    // We don't show technical details to users, just friendly messages
    throw new Error('Failed to load todos. Please check your connection.');
  }
};

/**
 * Create a new todo
 * 
 * Sends a POST request to create a new todo in the database. The backend will:
 * - Generate a unique ID
 * - Set the creation timestamp
 * - Save to database
 * - Return the complete todo object
 * 
 * This function is called when the user submits the "Add Todo" form.
 * 
 * @param {Object} todoData - The todo data to create
 * @param {string} todoData.title - The todo title (required)
 * @param {string} [todoData.description] - Optional description
 * @param {boolean} [todoData.completed] - Completion status (defaults to false)
 * 
 * @returns {Promise<Object>} The created todo object with ID and timestamp
 * @throws {Error} If creation fails or validation errors occur
 * 
 * @example
 * const newTodo = await createTodo({
 *   title: "Buy groceries",
 *   description: "Milk, eggs, bread",
 *   completed: false
 * });
 */
export const createTodo = async (todoData) => {
  try {
    // Log the data being sent for debugging
    // Helps verify that the component is passing correct data
    console.log('📡 Creating todo:', todoData);
    
    // POST request to /todos endpoint
    // Axios automatically:
    // - Stringifies the JavaScript object to JSON
    // - Sets Content-Type: application/json header
    // - Sends the request body
    const response = await api.post('/todos', todoData);
    
    // Log success for debugging
    console.log('✅ Todo created:', response.data);
    
    // Return just the todo object from the response
    // Backend returns: { message: "...", todo: {...} }
    // Components need just the todo object to update state
    return response.data.todo;
    
  } catch (error) {
    // Log the error for debugging
    console.error('❌ Error creating todo:', error);
    
    // Check if we got a response from the server
    if (error.response) {
      // Log HTTP status and response data
      // Common statuses:
      // - 400: Bad Request (validation error)
      // - 401: Unauthorized (if auth is implemented)
      // - 500: Internal Server Error
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
      
      // If backend sent a specific error message, use it
      // Otherwise, use a generic message
      // This provides better user feedback for validation errors
      throw new Error(error.response.data.message || 'Failed to create todo');
    }
    
    // If no response (network error, timeout, etc.), throw generic error
    throw new Error('Failed to create todo. Please try again.');
  }
};

/**
 * Update an existing todo
 * 
 * Sends a PUT request to update a todo's data. This is used for:
 * - Editing todo title/description (via edit modal)
 * - Toggling completion status (via checkbox)
 * - Any other todo modifications
 * 
 * The backend will validate the data and update the database, returning
 * the updated todo object with all fields.
 * 
 * @param {number} id - The ID of the todo to update
 * @param {Object} updateData - Object containing fields to update
 * @param {string} [updateData.title] - New title
 * @param {string} [updateData.description] - New description
 * @param {boolean} [updateData.completed] - New completion status
 * 
 * @returns {Promise<Object>} The updated todo object
 * @throws {Error} If update fails or todo not found (404)
 * 
 * @example
 * // Toggle completion
 * await updateTodo(1, { completed: true });
 * 
 * // Edit content
 * await updateTodo(1, { 
 *   title: "Updated title",
 *   description: "Updated description"
 * });
 */
export const updateTodo = async (id, updateData) => {
  try {
    // Log the update operation for debugging
    console.log('📡 Updating todo:', id, updateData);
    
    // PUT request to /todos/:id endpoint
    // Note: We use template literals to insert the ID into the URL
    // PUT is used for full updates (though we allow partial updates)
    const response = await api.put(`/todos/${id}`, updateData);
    
    // Log successful update
    console.log('✅ Todo updated:', response.data);
    
    // Return the updated todo object
    // Backend returns: { message: "...", todo: {...} }
    return response.data.todo;
    
  } catch (error) {
    // Log error details
    console.error('❌ Error updating todo:', error);
    
    // Check for specific error cases
    // 404 means the todo doesn't exist (maybe deleted by another user)
    if (error.response && error.response.status === 404) {
      throw new Error('Todo not found');
    }
    
    // Generic error for other cases (network, validation, etc.)
    throw new Error('Failed to update todo. Please try again.');
  }
};

/**
 * Delete a todo
 * 
 * Sends a DELETE request to permanently remove a todo from the database.
 * This is a destructive operation and should be confirmed by the user
 * before calling (handled in the component with window.confirm).
 * 
 * Unlike other functions, this doesn't return data (void return).
 * Success is indicated by the absence of an error.
 * 
 * @param {number} id - The ID of the todo to delete
 * @returns {Promise<void>} Resolves when deletion is complete
 * @throws {Error} If deletion fails or todo not found
 * 
 * @example
 * await deleteTodo(1);
 * console.log('Todo deleted successfully');
 */
export const deleteTodo = async (id) => {
  try {
    // Log the deletion attempt
    console.log('📡 Deleting todo:', id);
    
    // DELETE request to /todos/:id endpoint
    // We use 'await' even though we don't use the response
    // because we need to catch errors if deletion fails
    await api.delete(`/todos/${id}`);
    
    // Log successful deletion
    console.log('✅ Todo deleted');
    
    // No return value - successful completion is indicated by no error
    
  } catch (error) {
    // Log error details
    console.error('❌ Error deleting todo:', error);
    
    // Check if todo doesn't exist
    // 404 could happen if the todo was already deleted
    if (error.response && error.response.status === 404) {
      throw new Error('Todo not found');
    }
    
    // Generic error for other cases
    throw new Error('Failed to delete todo. Please try again.');
  }
};

// ============================================
// FUTURE ENHANCEMENTS
// ============================================

/**
 * Possible additions to this API service:
 * 
 * 1. Request Interceptors:
 *    - Add authentication tokens to requests
 *    - Add request ID for tracking
 *    - Log all requests for debugging
 * 
 * 2. Response Interceptors:
 *    - Handle common errors globally
 *    - Refresh auth tokens automatically
 *    - Transform response data
 * 
 * 3. Additional Endpoints:
 *    - getTodoById(id) - Fetch single todo
 *    - searchTodos(query) - Search functionality
 *    - filterTodos(status) - Filter by completion
 *    - bulkDelete(ids) - Delete multiple todos
 * 
 * 4. Caching:
 *    - Cache todo list to reduce API calls
 *    - Implement optimistic updates
 *    - Add retry logic for failed requests
 * 
 * 5. Better Error Handling:
 *    - Custom error classes for different error types
 *    - Retry failed requests automatically
 *    - Queue requests when offline
 * 
 * Example interceptor setup:
 * 
 * api.interceptors.request.use(
 *   config => {
 *     // Add auth token if it exists
 *     const token = localStorage.getItem('authToken');
 *     if (token) {
 *       config.headers.Authorization = `Bearer ${token}`;
 *     }
 *     return config;
 *   },
 *   error => Promise.reject(error)
 * );
 */
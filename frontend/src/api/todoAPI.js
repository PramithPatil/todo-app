/**
 * API service for todo operations.
 * 
 * This module centralizes all HTTP requests to the backend API. By keeping
 * API calls in one place, we make the code more maintainable and easier to
 * update if the API changes. It also makes testing easier since we can mock
 * this entire module.
 * 
 * We're using axios instead of fetch because it:
 * - Automatically transforms JSON data
 * - Has better error handling
 * - Provides request/response interceptors
 * - Has a cleaner syntax for common operations
 */

import axios from 'axios';

// Base URL for the Flask backend API
// In production, you'd use an environment variable: process.env.REACT_APP_API_URL
// This allows different URLs for development, staging, and production without code changes
const API_BASE_URL = 'http://localhost:5000/api';

/**
 * Fetch all todos from the backend.
 * 
 * This function is called when the app loads to populate the todo list.
 * It returns the complete list of todos with all their properties.
 * 
 * @returns {Promise<Array>} Array of todo objects
 * @throws {Error} If the network request fails
 */
export const getAllTodos = async () => {
  try {
    // axios.get automatically parses JSON response and throws on HTTP errors
    const response = await axios.get(`${API_BASE_URL}/todos`);
    
    // The backend returns { todos: [...], count: n }
    // We extract just the todos array since that's what components need
    return response.data.todos;
  } catch (error) {
    // Provide a user-friendly error message
    // In production, you might want to send this to an error tracking service
    console.error('Error fetching todos:', error);
    throw new Error('Failed to load todos. Please check your connection.');
  }
};

/**
 * Fetch a specific todo by its ID.
 * 
 * This isn't currently used in our UI since we work with the full list,
 * but it's included for API completeness and future features like
 * deep linking to specific todos.
 * 
 * @param {number} id - The ID of the todo to fetch
 * @returns {Promise<Object>} The todo object
 * @throws {Error} If the todo doesn't exist or request fails
 */
export const getTodoById = async (id) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/todos/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching todo ${id}:`, error);
    
    // Provide specific error messages based on the HTTP status
    if (error.response && error.response.status === 404) {
      throw new Error('Todo not found');
    }
    throw new Error('Failed to load todo');
  }
};

/**
 * Create a new todo.
 * 
 * This function is called when the user submits the add todo form.
 * It sends the todo data to the backend and returns the created todo
 * with its assigned ID and timestamp.
 * 
 * @param {Object} todoData - The todo data to create
 * @param {string} todoData.title - The todo title (required)
 * @param {string} [todoData.description] - The todo description (optional)
 * @param {boolean} [todoData.completed] - Completion status (defaults to false)
 * @returns {Promise<Object>} The created todo object with ID
 * @throws {Error} If validation fails or request fails
 */
export const createTodo = async (todoData) => {
  try {
    // axios.post automatically stringifies the data and sets Content-Type header
    const response = await axios.post(`${API_BASE_URL}/todos`, todoData);
    
    // Backend returns { message: "...", todo: {...} }
    // We return just the todo object for easy state updates
    return response.data.todo;
  } catch (error) {
    console.error('Error creating todo:', error);
    
    // Provide helpful error messages for common validation errors
    if (error.response && error.response.status === 400) {
      const message = error.response.data.message || 'Invalid todo data';
      throw new Error(message);
    }
    throw new Error('Failed to create todo. Please try again.');
  }
};

/**
 * Update an existing todo.
 * 
 * This function handles both editing todo content and toggling completion status.
 * It sends only the fields that need to be updated, making it efficient and flexible.
 * 
 * @param {number} id - The ID of the todo to update
 * @param {Object} updateData - Object with fields to update
 * @param {string} [updateData.title] - New title
 * @param {string} [updateData.description] - New description
 * @param {boolean} [updateData.completed] - New completion status
 * @returns {Promise<Object>} The updated todo object
 * @throws {Error} If todo not found or request fails
 */
export const updateTodo = async (id, updateData) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/todos/${id}`, updateData);
    return response.data.todo;
  } catch (error) {
    console.error(`Error updating todo ${id}:`, error);
    
    // Handle specific error cases
    if (error.response) {
      if (error.response.status === 404) {
        throw new Error('Todo not found');
      }
      if (error.response.status === 400) {
        const message = error.response.data.message || 'Invalid update data';
        throw new Error(message);
      }
    }
    throw new Error('Failed to update todo. Please try again.');
  }
};

/**
 * Delete a todo.
 * 
 * This function permanently removes a todo from the backend.
 * It's called when the user confirms deletion via the delete button.
 * 
 * @param {number} id - The ID of the todo to delete
 * @returns {Promise<void>}
 * @throws {Error} If todo not found or request fails
 */
export const deleteTodo = async (id) => {
  try {
    await axios.delete(`${API_BASE_URL}/todos/${id}`);
    // No return value needed - successful deletion is indicated by no error
  } catch (error) {
    console.error(`Error deleting todo ${id}:`, error);
    
    // Provide specific error handling
    if (error.response && error.response.status === 404) {
      throw new Error('Todo not found');
    }
    throw new Error('Failed to delete todo. Please try again.');
  }
};
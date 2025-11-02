/**
 * TodoList component that displays a list of todos.
 * 
 * This component is responsible for rendering the todo items and providing
 * a good user experience when the list is empty. It delegates the actual
 * rendering of individual todos to the TodoItem component, following the
 * single responsibility principle.
 * 
 * By keeping this as a separate component, we can easily add features like
 * filtering, sorting, or pagination without cluttering the main App component.
 */

import React from 'react';
import TodoItem from './TodoItem';

/**
 * TodoList functional component.
 * 
 * This component receives the list of todos and action handlers from the parent,
 * then maps over the todos to create TodoItem components. It's a presentational
 * component that focuses on layout and delegation.
 * 
 * @param {Object} props - Component props
 * @param {Array} props.todos - Array of todo objects to display
 * @param {Function} props.onToggle - Handler for toggling todo completion
 * @param {Function} props.onEdit - Handler for editing a todo
 * @param {Function} props.onDelete - Handler for deleting a todo
 */
function TodoList({ todos, onToggle, onEdit, onDelete }) {
  /**
   * Handle the empty state gracefully.
   * 
   * When there are no todos, we show an encouraging empty state message
   * rather than just displaying nothing. This is better UX because it:
   * 1. Confirms the app is working (not broken or still loading)
   * 2. Guides the user on what to do next
   * 3. Feels more polished and complete
   */
  if (todos.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-state-icon">📝</div>
        <h3>No todos yet</h3>
        <p>Add your first todo to get started!</p>
      </div>
    );
  }
  
  return (
    <div className="todo-list-section">
      <h2 className="section-title">
        Your Todos
        <span className="todo-count">{todos.length}</span>
      </h2>
      
      <div className="todo-list">
        {/* 
          Map over todos array to create TodoItem components.
          
          The key prop is crucial for React's reconciliation algorithm.
          It helps React identify which items have changed, been added, or removed,
          allowing for efficient updates. Using the todo's ID as the key is ideal
          because IDs are stable and unique.
          
          We're using the spread operator {...props} pattern to pass multiple
          handlers to each TodoItem, keeping the code DRY (Don't Repeat Yourself).
        */}
        {todos.map((todo) => (
          <TodoItem
            key={todo.id}
            todo={todo}
            onToggle={onToggle}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))}
      </div>
    </div>
  );
}

export default TodoList;
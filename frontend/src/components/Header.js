/**
 * Header component displaying app title and todo statistics.
 * 
 * This is a presentational component (also called a "dumb" component) that
 * receives data via props and focuses purely on display. It has no state or
 * side effects, making it easy to test and reuse.
 * 
 * We're showing key metrics that help users understand their productivity
 * at a glance: total todos, active (incomplete), and completed todos.
 */

import React from 'react';

/**
 * Header functional component.
 * 
 * Modern React favors functional components with hooks over class components
 * because they're more concise and easier to understand. For simple presentational
 * components like this, they're perfect.
 * 
 * @param {Object} props - Component props
 * @param {number} props.totalTodos - Total number of todos
 * @param {number} props.completedTodos - Number of completed todos
 * @param {number} props.activeTodos - Number of active (incomplete) todos
 */
function Header({ totalTodos, completedTodos, activeTodos }) {
  return (
    <header className="header">
      {/* Main title with icon */}
      <div className="header-title">
        <h1>
          {/* Using emoji for visual interest without requiring icon library */}
          <span className="header-icon">✓</span>
          Todo App
        </h1>
        <p className="header-subtitle">Stay organized and productive</p>
      </div>
      
      {/* Statistics cards */}
      {/* These give users immediate feedback about their progress */}
      <div className="stats">
        <div className="stat-card">
          <div className="stat-value">{totalTodos}</div>
          <div className="stat-label">Total</div>
        </div>
        
        <div className="stat-card stat-card-active">
          <div className="stat-value">{activeTodos}</div>
          <div className="stat-label">Active</div>
        </div>
        
        <div className="stat-card stat-card-completed">
          <div className="stat-value">{completedTodos}</div>
          <div className="stat-label">Completed</div>
        </div>
      </div>
    </header>
  );
}

export default Header;
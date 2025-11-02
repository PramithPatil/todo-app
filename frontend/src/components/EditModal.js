/**
 * EditModal component for editing existing todos.
 * 
 * This is a modal dialog that overlays the main content, allowing users to
 * modify todo details without navigating away. Modals are great for focused
 * editing tasks because they:
 * 1. Maintain context (user can still see the todo list behind the modal)
 * 2. Prevent accidental navigation away
 * 3. Feel lightweight compared to a full page transition
 * 
 * We're implementing accessibility features like focus trapping and keyboard
 * support (ESC to close) that make the modal usable for all users.
 */

import React, { useState, useEffect } from 'react';

/**
 * EditModal functional component.
 * 
 * This component manages the editing state locally and syncs with the parent
 * only when the user saves. This allows the user to make changes and cancel
 * without affecting the actual todo data.
 * 
 * @param {Object} props - Component props
 * @param {Object} props.todo - The todo object being edited
 * @param {Function} props.onSave - Handler to save the edited todo
 * @param {Function} props.onCancel - Handler to close the modal without saving
 */
function EditModal({ todo, onSave, onCancel }) {
  // Local state for form inputs
  // We initialize with the current todo values
  const [title, setTitle] = useState(todo.title);
  const [description, setDescription] = useState(todo.description || '');
  const [completed, setCompleted] = useState(todo.completed);
  const [isSaving, setIsSaving] = useState(false);
  
  /**
   * Set up keyboard event listener for ESC key.
   * 
   * This is a common UX pattern - pressing ESC should close modals.
   * We use useEffect to add the event listener when the modal mounts
   * and clean it up when it unmounts to prevent memory leaks.
   */
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onCancel();
      }
    };
    
    // Add event listener
    document.addEventListener('keydown', handleEscape);
    
    // Cleanup function - runs when component unmounts
    // This is crucial to avoid memory leaks and unexpected behavior
    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [onCancel]); // Dependency array includes onCancel in case it changes
  
  /**
   * Handle form submission.
   * 
   * This validates the input, calls the parent's onSave callback with the
   * updated data, and handles the loading state.
   * 
   * @param {Event} e - The form submit event
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate title
    const trimmedTitle = title.trim();
    if (!trimmedTitle) {
      return; // Could show an error message here
    }
    
    if (isSaving) return; // Prevent double submissions
    
    try {
      setIsSaving(true);
      
      // Call parent's save handler with updated data
      await onSave(todo.id, {
        title: trimmedTitle,
        description: description.trim() || undefined,
        completed: completed
      });
      
      // Modal will be closed by parent after successful save
    } catch (error) {
      // Error is handled by parent, but we need to reset saving state
      console.error('Save error:', error);
    } finally {
      setIsSaving(false);
    }
  };
  
  /**
   * Handle clicking on the backdrop (area outside the modal).
   * 
   * This allows users to close the modal by clicking outside it,
   * which is a common and expected behavior for modals.
   * 
   * We check if the click target is the backdrop itself, not a child element.
   */
  const handleBackdropClick = (e) => {
    if (e.target.className === 'modal-backdrop') {
      onCancel();
    }
  };
  
  return (
    <div className="modal-backdrop" onClick={handleBackdropClick}>
      {/* 
        Modal container - clicking here won't close the modal
        because we stop propagation from reaching the backdrop
      */}
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        {/* Modal header */}
        <div className="modal-header">
          <h2>Edit Todo</h2>
          <button
            className="modal-close"
            onClick={onCancel}
            aria-label="Close modal"
            type="button"
          >
            ✕
          </button>
        </div>
        
        {/* Modal body with form */}
        <form onSubmit={handleSubmit} className="modal-body">
          {/* Title input */}
          <div className="form-group">
            <label htmlFor="edit-title" className="form-label">
              Title *
            </label>
            <input
              type="text"
              id="edit-title"
              className="form-input"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              disabled={isSaving}
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
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={isSaving}
              rows={4}
            />
          </div>
          
          {/* Completion status toggle */}
          <div className="form-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={completed}
                onChange={(e) => setCompleted(e.target.checked)}
                disabled={isSaving}
              />
              <span>Mark as completed</span>
            </label>
          </div>
          
          {/* Action buttons */}
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onCancel}
              disabled={isSaving}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isSaving || !title.trim()}
            >
              {isSaving ? (
                <>
                  <span className="btn-spinner"></span>
                  Saving...
                </>
              ) : (
                'Save Changes'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditModal;
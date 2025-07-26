import React, { useState } from 'react';

const TodoItem = ({ todo, onUpdate, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    title: todo.title,
    description: todo.description || ''
  });

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditData({
      title: todo.title,
      description: todo.description || ''
    });
  };

  const handleSaveEdit = async () => {
    await onUpdate(todo.id, editData);
    setIsEditing(false);
  };

  const handleToggleComplete = async () => {
    await onUpdate(todo.id, { completed: !todo.completed });
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this todo?')) {
      await onDelete(todo.id);
    }
  };

  const handleEditChange = (e) => {
    setEditData({
      ...editData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className={`todo-item ${todo.completed ? 'completed' : ''}`} data-testid="todo-item">
      <div className="todo-content">
        {isEditing ? (
          <div className="edit-form">
            <div className="form-row">
              <div className="form-group">
                <input
                  type="text"
                  name="title"
                  value={editData.title}
                  onChange={handleEditChange}
                  data-testid="edit-title-input"
                  placeholder="Todo title"
                />
              </div>
              <div className="form-group">
                <input
                  type="text"
                  name="description"
                  value={editData.description}
                  onChange={handleEditChange}
                  data-testid="edit-description-input"
                  placeholder="Todo description"
                />
              </div>
            </div>
            <div className="todo-actions">
              <button 
                onClick={handleSaveEdit} 
                className="btn btn-success btn-sm"
                data-testid="save-edit-button"
              >
                Save
              </button>
              <button 
                onClick={handleCancelEdit} 
                className="btn btn-secondary btn-sm"
                data-testid="cancel-edit-button"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className={`todo-title ${todo.completed ? 'completed' : ''}`} data-testid="todo-title">
              {todo.title}
            </div>
            {todo.description && (
              <div className="todo-description" data-testid="todo-description">
                {todo.description}
              </div>
            )}
          </>
        )}
      </div>

      {!isEditing && (
        <div className="todo-actions">
          <button
            onClick={handleToggleComplete}
            className={`btn btn-sm ${todo.completed ? 'btn-secondary' : 'btn-success'}`}
            data-testid="toggle-complete-button"
          >
            {todo.completed ? 'Undo' : 'Complete'}
          </button>
          <button
            onClick={handleEdit}
            className="btn btn-primary btn-sm"
            data-testid="edit-todo-button"
          >
            Edit
          </button>
          <button
            onClick={handleDelete}
            className="btn btn-danger btn-sm"
            data-testid="delete-todo-button"
          >
            Delete
          </button>
        </div>
      )}
    </div>
  );
};

export default TodoItem;
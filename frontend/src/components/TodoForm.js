import React, { useState } from 'react';

const TodoForm = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      return;
    }

    await onSubmit(formData);
    
    // Reset form
    setFormData({
      title: '',
      description: ''
    });
  };

  return (
    <div className="todo-form">
      <h3>Add New Todo</h3>
      <form onSubmit={handleSubmit} data-testid="todo-form">
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="title">Title:</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              data-testid="title-input"
              placeholder="Enter todo title"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="description">Description:</label>
            <input
              type="text"
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              data-testid="description-input"
              placeholder="Enter todo description (optional)"
            />
          </div>
          
          <button 
            type="submit" 
            className="btn btn-success"
            data-testid="add-todo-button"
          >
            Add Todo
          </button>
        </div>
      </form>
    </div>
  );
};

export default TodoForm;
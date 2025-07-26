import React, { useState, useEffect } from 'react';
import { todosAPI } from '../services/api';
import TodoItem from './TodoItem';
import TodoForm from './TodoForm';

const TodoList = ({ user, onLogout }) => {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadTodos();
  }, []);

  const loadTodos = async () => {
    try {
      setLoading(true);
      const data = await todosAPI.getAll();
      setTodos(data);
    } catch (err) {
      setError('Failed to load todos. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTodo = async (todoData) => {
    try {
      const newTodo = await todosAPI.create(todoData);
      setTodos([...todos, newTodo]);
      setError('');
    } catch (err) {
      setError('Failed to create todo. Please try again.');
    }
  };

  const handleUpdateTodo = async (id, updates) => {
    try {
      const updatedTodo = await todosAPI.update(id, updates);
      setTodos(todos.map(todo => 
        todo.id === id ? updatedTodo : todo
      ));
      setError('');
    } catch (err) {
      setError('Failed to update todo. Please try again.');
    }
  };

  const handleDeleteTodo = async (id) => {
    try {
      await todosAPI.delete(id);
      setTodos(todos.filter(todo => todo.id !== id));
      setError('');
    } catch (err) {
      setError('Failed to delete todo. Please try again.');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    onLogout();
  };

  return (
    <div className="container">
      <div className="header">
        <h1>Todo App</h1>
        <div>
          <span data-testid="welcome-message">Welcome, {user.username}!</span>
          <button 
            onClick={handleLogout} 
            className="btn btn-secondary"
            style={{ marginLeft: '15px' }}
            data-testid="logout-button"
          >
            Logout
          </button>
        </div>
      </div>

      {error && (
        <div className="error-message" data-testid="error-message">
          {error}
        </div>
      )}

      <TodoForm onSubmit={handleCreateTodo} />

      {loading ? (
        <div className="loading" data-testid="loading">
          Loading todos...
        </div>
      ) : (
        <div className="todo-list" data-testid="todo-list">
          {todos.length === 0 ? (
            <div className="empty-state" data-testid="empty-state">
              <h3>No todos yet!</h3>
              <p>Create your first todo using the form above.</p>
            </div>
          ) : (
            todos.map(todo => (
              <TodoItem
                key={todo.id}
                todo={todo}
                onUpdate={handleUpdateTodo}
                onDelete={handleDeleteTodo}
              />
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default TodoList;
import React, { useState } from 'react';
import { authAPI } from '../services/api';

const Login = ({ onLogin }) => {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    // Clear error when user starts typing
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await authAPI.login(formData);
      
      // Store token and user info
      localStorage.setItem('authToken', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
      
      // Call parent callback
      onLogin(response.user);
    } catch (err) {
      const errorMessage = err.response?.data?.error || 'Login failed. Please try again.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <h2>Login to Todo App</h2>
      
      {error && (
        <div className="error-message" data-testid="error-message">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="login-form" data-testid="login-form">
        <div className="form-group">
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
            data-testid="username-input"
            placeholder="Enter your username"
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            data-testid="password-input"
            placeholder="Enter your password"
          />
        </div>

        <button 
          type="submit" 
          className="btn btn-primary"
          disabled={loading}
          data-testid="login-button"
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>

      <div style={{ marginTop: '20px', padding: '15px', backgroundColor: '#e9ecef', borderRadius: '4px' }}>
        <h4>Test Credentials:</h4>
        <p><strong>Username:</strong> admin</p>
        <p><strong>Password:</strong> password123</p>
        <p><strong>Alternative:</strong> testuser / test123</p>
      </div>
    </div>
  );
};

export default Login;
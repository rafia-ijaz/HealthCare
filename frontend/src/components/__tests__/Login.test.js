import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Login from '../Login';
import { authAPI } from '../../services/api';

// Mock the API
jest.mock('../../services/api');

describe('Login Component', () => {
  const mockOnLogin = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    // Clear localStorage after each test
    localStorage.clear();
  });

  test('renders login form with all elements', () => {
    render(<Login onLogin={mockOnLogin} />);
    
    expect(screen.getByText('Login to Todo App')).toBeInTheDocument();
    expect(screen.getByLabelText('Username:')).toBeInTheDocument();
    expect(screen.getByLabelText('Password:')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Login' })).toBeInTheDocument();
    expect(screen.getByText('Test Credentials:')).toBeInTheDocument();
  });

  test('displays test credentials information', () => {
    render(<Login onLogin={mockOnLogin} />);
    
    expect(screen.getByText('Username: admin')).toBeInTheDocument();
    expect(screen.getByText('Password: password123')).toBeInTheDocument();
    expect(screen.getByText('Alternative: testuser / test123')).toBeInTheDocument();
  });

  test('handles successful login', async () => {
    const user = userEvent.setup();
    const mockResponse = {
      token: 'mock-token',
      user: { id: '1', username: 'admin', email: 'admin@example.com' }
    };
    
    authAPI.login.mockResolvedValue(mockResponse);
    
    render(<Login onLogin={mockOnLogin} />);
    
    await user.type(screen.getByTestId('username-input'), 'admin');
    await user.type(screen.getByTestId('password-input'), 'password123');
    await user.click(screen.getByTestId('login-button'));
    
    await waitFor(() => {
      expect(authAPI.login).toHaveBeenCalledWith({
        username: 'admin',
        password: 'password123'
      });
    });
    
    expect(localStorage.getItem('authToken')).toBe('mock-token');
    expect(localStorage.getItem('user')).toBe(JSON.stringify(mockResponse.user));
    expect(mockOnLogin).toHaveBeenCalledWith(mockResponse.user);
  });

  test('handles login failure with error message', async () => {
    const user = userEvent.setup();
    authAPI.login.mockRejectedValue({
      response: { data: { error: 'Invalid credentials' } }
    });
    
    render(<Login onLogin={mockOnLogin} />);
    
    await user.type(screen.getByTestId('username-input'), 'invalid');
    await user.type(screen.getByTestId('password-input'), 'wrongpassword');
    await user.click(screen.getByTestId('login-button'));
    
    await waitFor(() => {
      expect(screen.getByTestId('error-message')).toHaveTextContent('Invalid credentials');
    });
    
    expect(mockOnLogin).not.toHaveBeenCalled();
    expect(localStorage.getItem('authToken')).toBeNull();
  });

  test('handles network error gracefully', async () => {
    const user = userEvent.setup();
    authAPI.login.mockRejectedValue(new Error('Network error'));
    
    render(<Login onLogin={mockOnLogin} />);
    
    await user.type(screen.getByTestId('username-input'), 'admin');
    await user.type(screen.getByTestId('password-input'), 'password123');
    await user.click(screen.getByTestId('login-button'));
    
    await waitFor(() => {
      expect(screen.getByTestId('error-message')).toHaveTextContent('Login failed. Please try again.');
    });
  });

  test('clears error message when user starts typing', async () => {
    const user = userEvent.setup();
    authAPI.login.mockRejectedValue({
      response: { data: { error: 'Invalid credentials' } }
    });
    
    render(<Login onLogin={mockOnLogin} />);
    
    // First, trigger an error
    await user.type(screen.getByTestId('username-input'), 'invalid');
    await user.type(screen.getByTestId('password-input'), 'wrongpassword');
    await user.click(screen.getByTestId('login-button'));
    
    await waitFor(() => {
      expect(screen.getByTestId('error-message')).toBeInTheDocument();
    });
    
    // Then start typing again
    await user.clear(screen.getByTestId('username-input'));
    await user.type(screen.getByTestId('username-input'), 'a');
    
    expect(screen.queryByTestId('error-message')).not.toBeInTheDocument();
  });

  test('shows loading state during login', async () => {
    const user = userEvent.setup();
    authAPI.login.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)));
    
    render(<Login onLogin={mockOnLogin} />);
    
    await user.type(screen.getByTestId('username-input'), 'admin');
    await user.type(screen.getByTestId('password-input'), 'password123');
    await user.click(screen.getByTestId('login-button'));
    
    expect(screen.getByText('Logging in...')).toBeInTheDocument();
    expect(screen.getByTestId('login-button')).toBeDisabled();
  });

  test('requires username and password fields', () => {
    render(<Login onLogin={mockOnLogin} />);
    
    const usernameInput = screen.getByTestId('username-input');
    const passwordInput = screen.getByTestId('password-input');
    
    expect(usernameInput).toBeRequired();
    expect(passwordInput).toBeRequired();
  });

  test('form submission is prevented when fields are empty', async () => {
    const user = userEvent.setup();
    render(<Login onLogin={mockOnLogin} />);
    
    await user.click(screen.getByTestId('login-button'));
    
    // Form validation should prevent submission
    expect(authAPI.login).not.toHaveBeenCalled();
  });
});
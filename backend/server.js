const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Middleware
app.use(cors());
app.use(express.json());

// In-memory data storage (for demo purposes)
let users = [
  {
    id: '1',
    username: 'admin',
    password: bcrypt.hashSync('password123', 10),
    email: 'admin@example.com'
  },
  {
    id: '2',
    username: 'testuser',
    password: bcrypt.hashSync('test123', 10),
    email: 'test@example.com'
  }
];

let todos = [
  {
    id: '1',
    title: 'Learn React',
    description: 'Complete React tutorial',
    completed: false,
    userId: '1',
    createdAt: new Date().toISOString()
  },
  {
    id: '2',
    title: 'Write Tests',
    description: 'Implement automated tests',
    completed: false,
    userId: '1',
    createdAt: new Date().toISOString()
  }
];

// Auth middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid or expired token' });
    }
    req.user = user;
    next();
  });
};

// Routes

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Login endpoint
app.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required' });
    }

    const user = users.find(u => u.username === username);
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: user.id, username: user.username },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get all todos for authenticated user
app.get('/todos', authenticateToken, (req, res) => {
  try {
    const userTodos = todos.filter(todo => todo.userId === req.user.id);
    res.json(userTodos);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create a new todo
app.post('/todos', authenticateToken, (req, res) => {
  try {
    const { title, description } = req.body;

    if (!title) {
      return res.status(400).json({ error: 'Title is required' });
    }

    const newTodo = {
      id: uuidv4(),
      title,
      description: description || '',
      completed: false,
      userId: req.user.id,
      createdAt: new Date().toISOString()
    };

    todos.push(newTodo);
    res.status(201).json(newTodo);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update a todo
app.put('/todos/:id', authenticateToken, (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, completed } = req.body;

    const todoIndex = todos.findIndex(todo => todo.id === id && todo.userId === req.user.id);
    if (todoIndex === -1) {
      return res.status(404).json({ error: 'Todo not found' });
    }

    if (title !== undefined) todos[todoIndex].title = title;
    if (description !== undefined) todos[todoIndex].description = description;
    if (completed !== undefined) todos[todoIndex].completed = completed;
    todos[todoIndex].updatedAt = new Date().toISOString();

    res.json(todos[todoIndex]);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete a todo
app.delete('/todos/:id', authenticateToken, (req, res) => {
  try {
    const { id } = req.params;
    const todoIndex = todos.findIndex(todo => todo.id === id && todo.userId === req.user.id);
    
    if (todoIndex === -1) {
      return res.status(404).json({ error: 'Todo not found' });
    }

    const deletedTodo = todos.splice(todoIndex, 1)[0];
    res.json({ message: 'Todo deleted successfully', todo: deletedTodo });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = { app, server };
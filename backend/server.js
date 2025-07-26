import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import { v4 as uuidv4 } from 'uuid';

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// In-memory storage for demo (in production, use a database)
let snippets = [
  {
    id: '1',
    title: 'Hello World React Component',
    code: `function HelloWorld() {
  return (
    <div className="hello-world">
      <h1>Hello, World! 🌍</h1>
      <p>Welcome to the Code Snippet Sharing Platform!</p>
    </div>
  );
}

export default HelloWorld;`,
    language: 'javascript',
    author: 'Demo User',
    createdAt: new Date().toISOString(),
    likes: 5
  },
  {
    id: '2',
    title: 'Python Fibonacci Generator',
    code: `def fibonacci_generator(n):
    """Generate fibonacci sequence up to n numbers"""
    a, b = 0, 1
    count = 0
    
    while count < n:
        yield a
        a, b = b, a + b
        count += 1

# Usage example
for num in fibonacci_generator(10):
    print(num, end=' ')`,
    language: 'python',
    author: 'Code Master',
    createdAt: new Date(Date.now() - 3600000).toISOString(),
    likes: 12
  }
];

let connectedUsers = 0;

// Socket.IO connection handling
io.on('connection', (socket) => {
  connectedUsers++;
  console.log(`User connected. Total users: ${connectedUsers}`);
  
  // Broadcast user count to all clients
  io.emit('userCount', connectedUsers);
  
  // Send current snippets to newly connected user
  socket.emit('initialSnippets', snippets);
  
  socket.on('disconnect', () => {
    connectedUsers--;
    console.log(`User disconnected. Total users: ${connectedUsers}`);
    io.emit('userCount', connectedUsers);
  });
  
  socket.on('likeSnippet', (snippetId) => {
    const snippet = snippets.find(s => s.id === snippetId);
    if (snippet) {
      snippet.likes++;
      io.emit('snippetLiked', { id: snippetId, likes: snippet.likes });
    }
  });
});

// API Routes

// Get all snippets
app.get('/api/snippets', (req, res) => {
  res.json(snippets.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
});

// Get snippet by ID
app.get('/api/snippets/:id', (req, res) => {
  const snippet = snippets.find(s => s.id === req.params.id);
  if (!snippet) {
    return res.status(404).json({ error: 'Snippet not found' });
  }
  res.json(snippet);
});

// Create new snippet
app.post('/api/snippets', (req, res) => {
  const { title, code, language, author } = req.body;
  
  if (!title || !code || !language) {
    return res.status(400).json({ error: 'Title, code, and language are required' });
  }
  
  const newSnippet = {
    id: uuidv4(),
    title: title.trim(),
    code: code.trim(),
    language: language.toLowerCase(),
    author: author?.trim() || 'Anonymous',
    createdAt: new Date().toISOString(),
    likes: 0
  };
  
  snippets.unshift(newSnippet);
  
  // Emit new snippet to all connected clients
  io.emit('newSnippet', newSnippet);
  
  res.status(201).json(newSnippet);
});

// Like a snippet
app.post('/api/snippets/:id/like', (req, res) => {
  const snippet = snippets.find(s => s.id === req.params.id);
  if (!snippet) {
    return res.status(404).json({ error: 'Snippet not found' });
  }
  
  snippet.likes++;
  
  // Emit like update to all connected clients
  io.emit('snippetLiked', { id: snippet.id, likes: snippet.likes });
  
  res.json({ likes: snippet.likes });
});

// Delete snippet
app.delete('/api/snippets/:id', (req, res) => {
  const index = snippets.findIndex(s => s.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ error: 'Snippet not found' });
  }
  
  const deletedSnippet = snippets.splice(index, 1)[0];
  
  // Emit deletion to all connected clients
  io.emit('snippetDeleted', deletedSnippet.id);
  
  res.json({ message: 'Snippet deleted successfully' });
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    connectedUsers: connectedUsers,
    totalSnippets: snippets.length
  });
});

server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📡 Socket.IO enabled for real-time features`);
  console.log(`🌐 API available at http://localhost:${PORT}/api`);
});
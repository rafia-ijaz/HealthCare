import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import toast, { Toaster } from 'react-hot-toast';
import SnippetList from './components/SnippetList';
import SnippetForm from './components/SnippetForm';
import Stats from './components/Stats';
import { Code2, Users, Heart } from 'lucide-react';

function App() {
  const [snippets, setSnippets] = useState([]);
  const [connectedUsers, setConnectedUsers] = useState(0);
  const [loading, setLoading] = useState(true);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    // Initialize socket connection
    const newSocket = io(process.env.REACT_APP_API_URL || 'http://localhost:5000');
    setSocket(newSocket);

    // Socket event listeners
    newSocket.on('connect', () => {
      console.log('Connected to server');
      toast.success('🔗 Connected to real-time server!');
    });

    newSocket.on('disconnect', () => {
      console.log('Disconnected from server');
      toast.error('📡 Disconnected from server');
    });

    newSocket.on('userCount', (count) => {
      setConnectedUsers(count);
    });

    newSocket.on('initialSnippets', (initialSnippets) => {
      setSnippets(initialSnippets);
      setLoading(false);
    });

    newSocket.on('newSnippet', (snippet) => {
      setSnippets(prev => [snippet, ...prev]);
      toast.success('🚀 New snippet shared!', {
        icon: '📝',
      });
    });

    newSocket.on('snippetLiked', ({ id, likes }) => {
      setSnippets(prev => 
        prev.map(snippet => 
          snippet.id === id ? { ...snippet, likes } : snippet
        )
      );
    });

    newSocket.on('snippetDeleted', (deletedId) => {
      setSnippets(prev => prev.filter(snippet => snippet.id !== deletedId));
      toast.success('🗑️ Snippet deleted');
    });

    // Fetch initial data as fallback
    fetchSnippets();

    return () => {
      newSocket.close();
    };
  }, []);

  const fetchSnippets = async () => {
    try {
      const response = await fetch('/api/snippets');
      if (response.ok) {
        const data = await response.json();
        setSnippets(data);
      }
    } catch (error) {
      console.error('Error fetching snippets:', error);
      toast.error('Failed to load snippets');
    } finally {
      setLoading(false);
    }
  };

  const handleSnippetSubmit = async (snippetData) => {
    try {
      const response = await fetch('/api/snippets', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(snippetData),
      });

      if (response.ok) {
        const newSnippet = await response.json();
        toast.success('✨ Snippet shared successfully!');
        return true;
      } else {
        const error = await response.json();
        toast.error(error.message || 'Failed to create snippet');
        return false;
      }
    } catch (error) {
      console.error('Error creating snippet:', error);
      toast.error('Failed to create snippet');
      return false;
    }
  };

  const handleLike = async (snippetId) => {
    try {
      // Optimistic update
      setSnippets(prev => 
        prev.map(snippet => 
          snippet.id === snippetId 
            ? { ...snippet, likes: snippet.likes + 1 } 
            : snippet
        )
      );

      // Emit like event through socket for real-time updates
      if (socket) {
        socket.emit('likeSnippet', snippetId);
      }

      // Also make API call as backup
      await fetch(`/api/snippets/${snippetId}/like`, {
        method: 'POST',
      });

      toast.success('❤️ Liked!', {
        duration: 1000,
      });
    } catch (error) {
      console.error('Error liking snippet:', error);
      // Revert optimistic update on error
      setSnippets(prev => 
        prev.map(snippet => 
          snippet.id === snippetId 
            ? { ...snippet, likes: snippet.likes - 1 } 
            : snippet
        )
      );
      toast.error('Failed to like snippet');
    }
  };

  const totalLikes = snippets.reduce((sum, snippet) => sum + snippet.likes, 0);

  return (
    <div className="App">
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#363636',
            color: '#fff',
          },
        }}
      />
      
      <div className="container">
        <header className="header">
          <h1>
            <Code2 size={48} style={{ display: 'inline', marginRight: '16px' }} />
            Code Snippet Hub
          </h1>
          <p>Share, discover, and love amazing code snippets in real-time</p>
          
          <Stats 
            connectedUsers={connectedUsers}
            totalSnippets={snippets.length}
            totalLikes={totalLikes}
          />
        </header>

        <main className="main-content">
          <div className="snippets-section">
            <div className="real-time-indicator">
              <div className="pulse"></div>
              <span>Real-time updates enabled</span>
            </div>
            
            <h2 style={{ marginBottom: '25px', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <Code2 size={24} />
              Latest Snippets
            </h2>
            
            <SnippetList 
              snippets={snippets}
              loading={loading}
              onLike={handleLike}
            />
          </div>

          <div className="form-section">
            <h2 style={{ marginBottom: '25px', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <Code2 size={24} />
              Share Your Code
            </h2>
            
            <SnippetForm onSubmit={handleSnippetSubmit} />
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;
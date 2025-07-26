import React from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Heart, User, Clock, Code } from 'lucide-react';

const SnippetList = ({ snippets, loading, onLike }) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now - date) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  const getLanguageDisplayName = (lang) => {
    const languages = {
      javascript: 'JavaScript',
      python: 'Python',
      java: 'Java',
      cpp: 'C++',
      c: 'C',
      csharp: 'C#',
      php: 'PHP',
      ruby: 'Ruby',
      go: 'Go',
      rust: 'Rust',
      typescript: 'TypeScript',
      html: 'HTML',
      css: 'CSS',
      sql: 'SQL',
      bash: 'Bash',
      json: 'JSON',
      yaml: 'YAML',
      xml: 'XML'
    };
    return languages[lang] || lang.charAt(0).toUpperCase() + lang.slice(1);
  };

  if (loading) {
    return (
      <div className="loading">
        <div style={{ fontSize: '2rem', marginBottom: '16px' }}>🔄</div>
        <p>Loading awesome snippets...</p>
      </div>
    );
  }

  if (snippets.length === 0) {
    return (
      <div className="no-snippets">
        <div style={{ fontSize: '3rem', marginBottom: '20px' }}>📝</div>
        <h3>No snippets yet!</h3>
        <p>Be the first to share an amazing code snippet with the community.</p>
      </div>
    );
  }

  return (
    <div className="snippet-list">
      {snippets.map((snippet) => (
        <div key={snippet.id} className="snippet-card">
          <div className="snippet-header">
            <h3 className="snippet-title">{snippet.title}</h3>
            <div className="snippet-meta">
              <span className="language-tag">
                <Code size={14} style={{ marginRight: '4px' }} />
                {getLanguageDisplayName(snippet.language)}
              </span>
            </div>
          </div>

          <div className="snippet-code">
            <SyntaxHighlighter
              language={snippet.language}
              style={vscDarkPlus}
              customStyle={{
                margin: 0,
                padding: 0,
                background: 'transparent',
                fontSize: '14px',
              }}
              wrapLongLines={true}
            >
              {snippet.code}
            </SyntaxHighlighter>
          </div>

          <div className="snippet-actions">
            <div className="snippet-meta">
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <User size={14} />
                {snippet.author}
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Clock size={14} />
                {formatDate(snippet.createdAt)}
              </span>
            </div>

            <button
              className="like-btn"
              onClick={() => onLike(snippet.id)}
              title="Like this snippet"
            >
              <Heart 
                size={16} 
                fill={snippet.likes > 0 ? 'currentColor' : 'none'}
              />
              <span>{snippet.likes}</span>
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SnippetList;
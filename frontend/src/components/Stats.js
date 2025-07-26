import React from 'react';
import { Users, Code, Heart } from 'lucide-react';

const Stats = ({ connectedUsers, totalSnippets, totalLikes }) => {
  return (
    <div className="stats">
      <div className="stat-item">
        <Users size={20} style={{ marginBottom: '8px' }} />
        <span className="stat-number">{connectedUsers}</span>
        <span className="stat-label">Online</span>
      </div>
      
      <div className="stat-item">
        <Code size={20} style={{ marginBottom: '8px' }} />
        <span className="stat-number">{totalSnippets}</span>
        <span className="stat-label">Snippets</span>
      </div>
      
      <div className="stat-item">
        <Heart size={20} style={{ marginBottom: '8px' }} />
        <span className="stat-number">{totalLikes}</span>
        <span className="stat-label">Total Likes</span>
      </div>
    </div>
  );
};

export default Stats;
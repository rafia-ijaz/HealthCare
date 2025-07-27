🚀 Real-Time Patient Notes Sharing App
A real-time healthcare application built with React and Node.js, designed for providers to securely share patient notes/snippets instantly. Features live updates, syntax highlighting for medical data, and a modern responsive UI/UX optimized for desktop and mobile.

✨ Features
🔥 Core Features
Real-time Updates: See new snippets and likes instantly using Socket.IO
Syntax Highlighting: Beautiful code presentation with Prism.js
Multi-language Support: Support for 18+ programming languages
Interactive Likes: Like snippets with real-time counter updates
Responsive Design: Works perfectly on desktop and mobile devices
Modern UI: Clean, gradient-based design with smooth animations
🛠 Technical Features
RESTful API: Clean API design with proper HTTP methods
WebSocket Integration: Real-time bidirectional communication
Form Validation: Client-side validation with user-friendly error messages
Toast Notifications: Real-time feedback for user actions
Optimistic Updates: Instant UI updates for better user experience
Error Handling: Graceful error handling throughout the application
🏗 Architecture
Backend (Node.js + Express)
Express.js: Web framework for RESTful API
Socket.IO: Real-time WebSocket communication
CORS: Cross-origin resource sharing
UUID: Unique identifier generation
In-memory Storage: Simple data persistence (easily replaceable with database)
Frontend (React)
React 18: Modern React with hooks
Socket.IO Client: Real-time communication
React Syntax Highlighter: Code syntax highlighting
Lucide React: Beautiful icon system
React Hot Toast: Elegant notification system
🚀 Quick Start
Prerequisites
Node.js (v16 or higher)
npm or yarn
Installation
Clone the repository (if applicable):

git clone <repository-url>
cd code-snippet-platform
Install Backend Dependencies:

cd backend
npm install
Install Frontend Dependencies:

cd frontend
npm install
Running the Application
Start the Backend Server:

cd backend
npm run dev
The server will start on http://localhost:5000

Start the Frontend Application (in a new terminal):

cd frontend
npm start
The app will open in your browser at http://localhost:3000

📊 API Endpoints
Snippets
GET /api/snippets - Get all snippets (sorted by creation date)
GET /api/snippets/:id - Get specific snippet by ID
POST /api/snippets - Create new snippet
POST /api/snippets/:id/like - Like a snippet
DELETE /api/snippets/:id - Delete a snippet
Health Check
GET /api/health - Server health status and statistics
🔌 Real-time Events
Client to Server
likeSnippet - Like a specific snippet
Server to Client
userCount - Current number of connected users
initialSnippets - Send all snippets to newly connected client
newSnippet - Broadcast new snippet to all clients
snippetLiked - Broadcast like update to all clients
snippetDeleted - Broadcast snippet deletion to all clients
🎨 UI/UX Features
Gradient Background: Beautiful purple gradient background
Card-based Layout: Clean card design for snippets
Smooth Animations: CSS transitions and animations
Responsive Grid: Adaptive layout for different screen sizes
Real-time Indicators: Visual indicators for live connections
Toast Notifications: Instant feedback for user actions
Loading States: Elegant loading indicators
Error Handling: User-friendly error messages
🛡 Form Validation
Title Validation: Minimum 3 characters required
Code Validation: Minimum 10 characters required
Language Selection: Required field with multiple options
Real-time Feedback: Instant validation as user types
📱 Responsive Design
Mobile-first Approach: Optimized for mobile devices
Flexible Grid: Adapts to different screen sizes
Touch-friendly: Large touch targets for mobile interaction
Readable Typography: Optimized font sizes for all devices
🔮 Future Enhancements
User Authentication: User accounts and profiles
Database Integration: PostgreSQL or MongoDB
Code Execution: Run code snippets in sandboxed environment
Search Functionality: Search snippets by title, language, or content
Tagging System: Organize snippets with tags
Comments: Allow users to comment on snippets
Private Snippets: Option to create private snippets
Export Features: Export snippets as files
Themes: Multiple color themes
Advanced Filtering: Filter by language, date, popularity
🤝 Contributing
Fork the repository
Create a feature branch (git checkout -b feature/amazing-feature)
Commit your changes (git commit -m 'Add amazing feature')
Push to the branch (git push origin feature/amazing-feature)
Open a Pull Request
📄 License
This project is licensed under the MIT License - see the LICENSE file for details.

🙏 Acknowledgments
React Team for the amazing React framework
Socket.IO Team for real-time communication
Prism.js for syntax highlighting
Lucide for beautiful icons
React Hot Toast for elegant notifications

# QA Automation Assessment - Todo Application

## Overview

This project is a comprehensive QA automation assessment featuring a full-stack Todo application with extensive test coverage. It demonstrates modern testing practices across UI automation, API testing, and CI/CD integration.

## 🚀 Quick Start (1-2 minutes setup)

### Prerequisites
- Node.js 18+ installed
- npm package manager

### Setup & Run
```bash
# Clone repository
git clone <your-repository-url>
cd qa-automation-assessment

# Install all dependencies (backend, frontend, and tests)
npm run install:all

# Start both frontend and backend servers
npm run dev
```

**Access the application:**
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

**Test Credentials:**
- Username: `admin` | Password: `password123`
- Username: `testuser` | Password: `test123`

## 🧪 Running Tests

```bash
# Run all tests (API, Frontend, E2E)
npm test

# Run specific test suites
npm run test:backend    # API tests with Supertest
npm run test:frontend   # React component tests
npm run test:e2e        # Cypress E2E tests

# Run tests with coverage
npm run test:coverage
```

## 📋 Test Coverage

### ✅ UI Automation (Cypress)
- **Login/Logout**: Valid/invalid credentials, session persistence
- **Todo CRUD**: Create, edit, delete, complete todos
- **Form validation**: Required fields, error handling
- **Data assertions**: Verify todo content and state changes

### ✅ API Automation (Supertest + Jest)
- **POST /login**: Authentication with positive/negative test cases
- **GET /todos**: Retrieve user todos with authorization
- **POST /todos**: Create todos with validation
- **PUT /todos/:id**: Update existing todos
- **DELETE /todos/:id**: Delete todos with confirmation
- **Security**: Token validation, unauthorized access prevention

### ✅ Unit Testing (React Testing Library)
- Component rendering and interaction
- Form submission and validation
- Error state handling
- User event simulation

## 🏗️ Project Structure

```
qa-automation-assessment/
├── backend/                 # Node.js API server
│   ├── server.js           # Express server with JWT auth
│   ├── tests/              # API test suites
│   └── package.json        # Backend dependencies
├── frontend/               # React application
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── services/       # API service layer
│   │   └── __tests__/      # Component tests
│   └── package.json        # Frontend dependencies
├── tests/                  # E2E Cypress tests
│   ├── cypress/
│   │   ├── e2e/           # Test specifications
│   │   └── support/       # Custom commands
│   └── cypress.config.js   # Cypress configuration
├── .github/workflows/      # CI/CD pipeline
├── TEST_PLAN.md           # Comprehensive test strategy
└── README.md              # This file
```

## 🔧 Technology Stack

### Frontend
- **React 18** - Modern UI framework
- **Axios** - HTTP client for API calls
- **React Testing Library** - Component testing

### Backend
- **Node.js + Express** - REST API server
- **JWT** - Authentication tokens
- **bcryptjs** - Password hashing
- **Supertest + Jest** - API testing

### Testing Tools
- **Cypress** - E2E testing framework
- **Jest** - Unit and API testing
- **React Testing Library** - React component testing

### CI/CD
- **GitHub Actions** - Automated testing pipeline
- **Codecov** - Code coverage reporting

## 🎯 Key Features Demonstrated

### Authentication Security
- JWT token-based authentication
- Secure password hashing
- Session management and cleanup
- Token expiration handling

### CRUD Operations
- Complete todo lifecycle management
- Real-time UI updates
- Data persistence
- Input validation

### Error Handling
- Network error recovery
- Form validation with user feedback
- Loading states and user experience
- Graceful degradation

### Testing Best Practices
- Test isolation and independence
- Positive and negative test scenarios
- Custom Cypress commands for reusability
- Comprehensive assertions and data validation

## 📊 CI/CD Pipeline

The project includes a robust GitHub Actions pipeline that:

- **Parallel Testing**: Runs API, Frontend, and E2E tests simultaneously
- **Multi-Version Support**: Tests on Node.js 18.x and 20.x
- **Code Coverage**: Generates and uploads coverage reports
- **Artifact Storage**: Saves test videos and screenshots
- **Security Auditing**: Checks for dependency vulnerabilities
- **Automated Deployment**: Builds and archives production artifacts

## 📖 Test Documentation

See [TEST_PLAN.md](TEST_PLAN.md) for comprehensive test strategy including:
- Test coverage areas and rationale
- Tool selection justification
- Test data management strategy
- Risk assessment and mitigation
- Success criteria and metrics

## 🏆 Assessment Requirements Fulfilled

| Requirement | Status | Implementation |
|-------------|--------|----------------|
| **UI Automation** | ✅ Complete | Cypress tests covering login, CRUD operations, and validation |
| **API Automation** | ✅ Complete | Supertest tests for all endpoints with positive/negative scenarios |
| **Test Documentation** | ✅ Complete | Comprehensive test plan with strategy and setup instructions |
| **Code Structure** | ✅ Complete | Clean, readable code with proper naming and organization |
| **CI Integration** | ✅ Bonus | GitHub Actions pipeline with multi-environment testing |
| **Code Coverage** | ✅ Bonus | Jest coverage reporting integrated into CI/CD |

## 🚀 Production Deployment

```bash
# Build for production
npm run build

# Start production server
npm start
```

## 🤝 Development Notes

### Time Investment
- **Setup**: ~45 minutes (project structure, dependencies)
- **Backend Development**: ~60 minutes (API endpoints, authentication)
- **Frontend Development**: ~90 minutes (React components, styling)
- **Test Implementation**: ~120 minutes (API, UI, E2E tests)
- **CI/CD Setup**: ~30 minutes (GitHub Actions configuration)
- **Documentation**: ~15 minutes (README, test plan)

**Total**: ~6 hours (comprehensive implementation exceeding basic requirements)

### Design Decisions
- **Monorepo Structure**: Simplifies dependency management and CI/CD
- **JWT Authentication**: Industry-standard secure authentication
- **Cypress over Selenium**: Better developer experience and reliability
- **React Testing Library**: Testing best practices and accessibility focus
- **In-Memory Storage**: Simplified demo without database complexity

---

**Created for Rem Waste QA Automation Engineer Assessment**  
*Demonstrating comprehensive testing skills and modern automation practices*
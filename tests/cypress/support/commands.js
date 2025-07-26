// Custom command to login
Cypress.Commands.add('login', (username = Cypress.env('VALID_USERNAME'), password = Cypress.env('VALID_PASSWORD')) => {
  cy.visit('/');
  cy.get('[data-testid="username-input"]').type(username);
  cy.get('[data-testid="password-input"]').type(password);
  cy.get('[data-testid="login-button"]').click();
});

// Custom command to login via API (faster for setup)
Cypress.Commands.add('loginAPI', (username = Cypress.env('VALID_USERNAME'), password = Cypress.env('VALID_PASSWORD')) => {
  cy.request({
    method: 'POST',
    url: `${Cypress.env('API_URL')}/login`,
    body: {
      username,
      password
    }
  }).then((response) => {
    expect(response.status).to.eq(200);
    expect(response.body).to.have.property('token');
    
    // Store the token in localStorage
    window.localStorage.setItem('authToken', response.body.token);
    window.localStorage.setItem('user', JSON.stringify(response.body.user));
  });
});

// Custom command to create a todo via API
Cypress.Commands.add('createTodoAPI', (title, description = '') => {
  const token = window.localStorage.getItem('authToken');
  
  cy.request({
    method: 'POST',
    url: `${Cypress.env('API_URL')}/todos`,
    headers: {
      'Authorization': `Bearer ${token}`
    },
    body: {
      title,
      description
    }
  }).then((response) => {
    expect(response.status).to.eq(201);
    return response.body;
  });
});

// Custom command to delete all todos via API
Cypress.Commands.add('deleteAllTodosAPI', () => {
  const token = window.localStorage.getItem('authToken');
  
  // First get all todos
  cy.request({
    method: 'GET',
    url: `${Cypress.env('API_URL')}/todos`,
    headers: {
      'Authorization': `Bearer ${token}`
    }
  }).then((response) => {
    const todos = response.body;
    
    // Delete each todo
    todos.forEach(todo => {
      cy.request({
        method: 'DELETE',
        url: `${Cypress.env('API_URL')}/todos/${todo.id}`,
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
    });
  });
});

// Custom command to logout
Cypress.Commands.add('logout', () => {
  cy.get('[data-testid="logout-button"]').click();
});

// Custom command to clear browser storage
Cypress.Commands.add('clearStorage', () => {
  cy.clearLocalStorage();
  cy.clearCookies();
});

// Custom assertion for todo items
Cypress.Commands.add('shouldHaveTodo', (title, description = null) => {
  cy.get('[data-testid="todo-item"]').should('contain', title);
  if (description) {
    cy.get('[data-testid="todo-item"]').should('contain', description);
  }
});

// Custom command to wait for loading to complete
Cypress.Commands.add('waitForLoad', () => {
  cy.get('[data-testid="loading"]').should('not.exist');
});
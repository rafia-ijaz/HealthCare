describe('Authentication', () => {
  beforeEach(() => {
    cy.clearStorage();
  });

  describe('Login with Valid Credentials', () => {
    it('should login successfully with valid credentials', () => {
      cy.visit('/');
      
      // Verify login form is displayed
      cy.get('[data-testid="login-form"]').should('be.visible');
      cy.get('h2').should('contain', 'Login to Todo App');
      
      // Enter valid credentials
      cy.get('[data-testid="username-input"]').type(Cypress.env('VALID_USERNAME'));
      cy.get('[data-testid="password-input"]').type(Cypress.env('VALID_PASSWORD'));
      
      // Submit form
      cy.get('[data-testid="login-button"]').click();
      
      // Verify successful login
      cy.get('[data-testid="welcome-message"]').should('contain', `Welcome, ${Cypress.env('VALID_USERNAME')}!`);
      cy.get('[data-testid="logout-button"]').should('be.visible');
      cy.url().should('not.contain', '/login');
      
      // Verify localStorage contains auth data
      cy.window().then((win) => {
        expect(win.localStorage.getItem('authToken')).to.not.be.null;
        expect(win.localStorage.getItem('user')).to.not.be.null;
      });
    });

    it('should persist login state on page refresh', () => {
      cy.login();
      
      // Verify user is logged in
      cy.get('[data-testid="welcome-message"]').should('be.visible');
      
      // Refresh the page
      cy.reload();
      
      // Verify user is still logged in
      cy.get('[data-testid="welcome-message"]').should('be.visible');
      cy.get('[data-testid="logout-button"]').should('be.visible');
    });

    it('should display test credentials information', () => {
      cy.visit('/');
      
      cy.get('h4').should('contain', 'Test Credentials:');
      cy.contains('Username: admin').should('be.visible');
      cy.contains('Password: password123').should('be.visible');
      cy.contains('Alternative: testuser / test123').should('be.visible');
    });
  });

  describe('Login with Invalid Credentials', () => {
    it('should show error message for invalid username', () => {
      cy.visit('/');
      
      cy.get('[data-testid="username-input"]').type(Cypress.env('INVALID_USERNAME'));
      cy.get('[data-testid="password-input"]').type(Cypress.env('VALID_PASSWORD'));
      cy.get('[data-testid="login-button"]').click();
      
      cy.get('[data-testid="error-message"]').should('contain', 'Invalid credentials');
      cy.get('[data-testid="welcome-message"]').should('not.exist');
    });

    it('should show error message for invalid password', () => {
      cy.visit('/');
      
      cy.get('[data-testid="username-input"]').type(Cypress.env('VALID_USERNAME'));
      cy.get('[data-testid="password-input"]').type(Cypress.env('INVALID_PASSWORD'));
      cy.get('[data-testid="login-button"]').click();
      
      cy.get('[data-testid="error-message"]').should('contain', 'Invalid credentials');
      cy.get('[data-testid="welcome-message"]').should('not.exist');
    });

    it('should clear error message when user starts typing', () => {
      cy.visit('/');
      
      // First, create an error
      cy.get('[data-testid="username-input"]').type(Cypress.env('INVALID_USERNAME'));
      cy.get('[data-testid="password-input"]').type(Cypress.env('INVALID_PASSWORD'));
      cy.get('[data-testid="login-button"]').click();
      
      cy.get('[data-testid="error-message"]').should('be.visible');
      
      // Start typing in username field
      cy.get('[data-testid="username-input"]').clear().type('a');
      
      // Error should be cleared
      cy.get('[data-testid="error-message"]').should('not.exist');
    });

    it('should not submit form with empty fields', () => {
      cy.visit('/');
      
      cy.get('[data-testid="login-button"]').click();
      
      // Form should not submit (browser validation)
      cy.get('[data-testid="error-message"]').should('not.exist');
      cy.get('[data-testid="welcome-message"]').should('not.exist');
      cy.url().should('contain', '/');
    });
  });

  describe('Form Validation', () => {
    it('should require username field', () => {
      cy.visit('/');
      
      cy.get('[data-testid="username-input"]').should('have.attr', 'required');
    });

    it('should require password field', () => {
      cy.visit('/');
      
      cy.get('[data-testid="password-input"]').should('have.attr', 'required');
    });

    it('should show loading state during login', () => {
      cy.visit('/');
      
      cy.get('[data-testid="username-input"]').type(Cypress.env('VALID_USERNAME'));
      cy.get('[data-testid="password-input"]').type(Cypress.env('VALID_PASSWORD'));
      
      // Intercept the login request to add delay
      cy.intercept('POST', '**/login', (req) => {
        req.reply((res) => {
          return new Promise((resolve) => {
            setTimeout(() => resolve(res), 1000);
          });
        });
      }).as('loginRequest');
      
      cy.get('[data-testid="login-button"]').click();
      
      // Check loading state
      cy.get('[data-testid="login-button"]').should('contain', 'Logging in...');
      cy.get('[data-testid="login-button"]').should('be.disabled');
      
      cy.wait('@loginRequest');
    });
  });

  describe('Logout', () => {
    it('should logout successfully', () => {
      cy.login();
      
      // Verify user is logged in
      cy.get('[data-testid="welcome-message"]').should('be.visible');
      
      // Logout
      cy.logout();
      
      // Verify user is logged out
      cy.get('[data-testid="login-form"]').should('be.visible');
      cy.get('[data-testid="welcome-message"]').should('not.exist');
      
      // Verify localStorage is cleared
      cy.window().then((win) => {
        expect(win.localStorage.getItem('authToken')).to.be.null;
        expect(win.localStorage.getItem('user')).to.be.null;
      });
    });

    it('should redirect to login after logout', () => {
      cy.login();
      cy.logout();
      
      cy.get('[data-testid="login-form"]').should('be.visible');
      cy.get('h2').should('contain', 'Login to Todo App');
    });
  });

  describe('Session Management', () => {
    it('should handle expired token gracefully', () => {
      cy.login();
      
      // Simulate expired token by setting invalid token
      cy.window().then((win) => {
        win.localStorage.setItem('authToken', 'expired-token');
      });
      
      // Try to access protected resource
      cy.reload();
      
      // Should be redirected to login
      cy.get('[data-testid="login-form"]').should('be.visible');
    });
  });
});
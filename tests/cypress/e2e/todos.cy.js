describe('Todo Management', () => {
  beforeEach(() => {
    cy.clearStorage();
    cy.loginAPI();
    cy.deleteAllTodosAPI();
    cy.visit('/');
  });

  describe('Creating Todos', () => {
    it('should create a new todo with title and description', () => {
      const todoTitle = 'Test Todo';
      const todoDescription = 'This is a test todo description';
      
      cy.get('[data-testid="title-input"]').type(todoTitle);
      cy.get('[data-testid="description-input"]').type(todoDescription);
      cy.get('[data-testid="add-todo-button"]').click();
      
      // Verify todo appears in list
      cy.shouldHaveTodo(todoTitle, todoDescription);
      cy.get('[data-testid="todo-title"]').should('contain', todoTitle);
      cy.get('[data-testid="todo-description"]').should('contain', todoDescription);
      
      // Verify form is cleared
      cy.get('[data-testid="title-input"]').should('have.value', '');
      cy.get('[data-testid="description-input"]').should('have.value', '');
    });

    it('should create a todo with only title (description optional)', () => {
      const todoTitle = 'Todo without description';
      
      cy.get('[data-testid="title-input"]').type(todoTitle);
      cy.get('[data-testid="add-todo-button"]').click();
      
      cy.shouldHaveTodo(todoTitle);
      cy.get('[data-testid="todo-title"]').should('contain', todoTitle);
    });

    it('should not create a todo with empty title', () => {
      cy.get('[data-testid="description-input"]').type('Description without title');
      cy.get('[data-testid="add-todo-button"]').click();
      
      // Todo should not be created
      cy.get('[data-testid="todo-item"]').should('not.exist');
      cy.get('[data-testid="empty-state"]').should('be.visible');
    });

    it('should show empty state when no todos exist', () => {
      cy.get('[data-testid="empty-state"]').should('be.visible');
      cy.get('[data-testid="empty-state"]').should('contain', 'No todos yet!');
      cy.get('[data-testid="empty-state"]').should('contain', 'Create your first todo using the form above.');
    });

    it('should create multiple todos', () => {
      const todos = [
        { title: 'First Todo', description: 'First description' },
        { title: 'Second Todo', description: 'Second description' },
        { title: 'Third Todo', description: 'Third description' }
      ];
      
      todos.forEach(todo => {
        cy.get('[data-testid="title-input"]').type(todo.title);
        cy.get('[data-testid="description-input"]').type(todo.description);
        cy.get('[data-testid="add-todo-button"]').click();
      });
      
      // Verify all todos are displayed
      cy.get('[data-testid="todo-item"]').should('have.length', 3);
      todos.forEach(todo => {
        cy.shouldHaveTodo(todo.title, todo.description);
      });
    });
  });

  describe('Reading/Displaying Todos', () => {
    beforeEach(() => {
      // Create some test todos via API
      cy.createTodoAPI('Sample Todo 1', 'First sample description');
      cy.createTodoAPI('Sample Todo 2', 'Second sample description');
      cy.createTodoAPI('Todo without description');
      cy.reload();
    });

    it('should display all todos on page load', () => {
      cy.get('[data-testid="todo-item"]').should('have.length', 3);
      cy.shouldHaveTodo('Sample Todo 1', 'First sample description');
      cy.shouldHaveTodo('Sample Todo 2', 'Second sample description');
      cy.shouldHaveTodo('Todo without description');
    });

    it('should display todo details correctly', () => {
      cy.get('[data-testid="todo-item"]').first().within(() => {
        cy.get('[data-testid="todo-title"]').should('be.visible');
        cy.get('[data-testid="todo-description"]').should('be.visible');
        cy.get('[data-testid="edit-todo-button"]').should('be.visible');
        cy.get('[data-testid="delete-todo-button"]').should('be.visible');
        cy.get('[data-testid="toggle-complete-button"]').should('be.visible');
      });
    });

    it('should show loading state while fetching todos', () => {
      // Intercept the API request to add delay
      cy.intercept('GET', '**/todos', (req) => {
        req.reply((res) => {
          return new Promise((resolve) => {
            setTimeout(() => resolve(res), 1000);
          });
        });
      }).as('getTodos');
      
      cy.reload();
      
      cy.get('[data-testid="loading"]').should('be.visible');
      cy.wait('@getTodos');
      cy.get('[data-testid="loading"]').should('not.exist');
    });
  });

  describe('Editing Todos', () => {
    beforeEach(() => {
      cy.createTodoAPI('Editable Todo', 'Original description');
      cy.reload();
    });

    it('should edit todo title and description', () => {
      const newTitle = 'Updated Todo Title';
      const newDescription = 'Updated description';
      
      cy.get('[data-testid="edit-todo-button"]').click();
      
      // Verify edit form appears
      cy.get('[data-testid="edit-title-input"]').should('be.visible');
      cy.get('[data-testid="edit-description-input"]').should('be.visible');
      cy.get('[data-testid="save-edit-button"]').should('be.visible');
      cy.get('[data-testid="cancel-edit-button"]').should('be.visible');
      
      // Edit the todo
      cy.get('[data-testid="edit-title-input"]').clear().type(newTitle);
      cy.get('[data-testid="edit-description-input"]').clear().type(newDescription);
      cy.get('[data-testid="save-edit-button"]').click();
      
      // Verify changes are saved
      cy.shouldHaveTodo(newTitle, newDescription);
      cy.get('[data-testid="edit-title-input"]').should('not.exist');
    });

    it('should cancel edit operation', () => {
      const originalTitle = 'Editable Todo';
      
      cy.get('[data-testid="edit-todo-button"]').click();
      
      // Make changes
      cy.get('[data-testid="edit-title-input"]').clear().type('Changed Title');
      cy.get('[data-testid="cancel-edit-button"]').click();
      
      // Verify original content is preserved
      cy.shouldHaveTodo(originalTitle);
      cy.get('[data-testid="edit-title-input"]').should('not.exist');
    });

    it('should pre-populate edit form with current values', () => {
      cy.get('[data-testid="edit-todo-button"]').click();
      
      cy.get('[data-testid="edit-title-input"]').should('have.value', 'Editable Todo');
      cy.get('[data-testid="edit-description-input"]').should('have.value', 'Original description');
    });
  });

  describe('Completing/Toggling Todos', () => {
    beforeEach(() => {
      cy.createTodoAPI('Todo to Complete', 'This todo will be completed');
      cy.reload();
    });

    it('should mark todo as completed', () => {
      cy.get('[data-testid="toggle-complete-button"]').should('contain', 'Complete');
      cy.get('[data-testid="toggle-complete-button"]').click();
      
      // Verify todo is marked as completed
      cy.get('[data-testid="todo-item"]').should('have.class', 'completed');
      cy.get('[data-testid="todo-title"]').should('have.class', 'completed');
      cy.get('[data-testid="toggle-complete-button"]').should('contain', 'Undo');
    });

    it('should toggle todo completion status', () => {
      // Mark as completed
      cy.get('[data-testid="toggle-complete-button"]').click();
      cy.get('[data-testid="todo-item"]').should('have.class', 'completed');
      
      // Mark as incomplete
      cy.get('[data-testid="toggle-complete-button"]').click();
      cy.get('[data-testid="todo-item"]').should('not.have.class', 'completed');
      cy.get('[data-testid="toggle-complete-button"]').should('contain', 'Complete');
    });
  });

  describe('Deleting Todos', () => {
    beforeEach(() => {
      cy.createTodoAPI('Todo to Delete', 'This todo will be deleted');
      cy.createTodoAPI('Todo to Keep', 'This todo will remain');
      cy.reload();
    });

    it('should delete a todo after confirmation', () => {
      cy.get('[data-testid="todo-item"]').should('have.length', 2);
      
      // Mock window.confirm to return true
      cy.window().then((win) => {
        cy.stub(win, 'confirm').returns(true);
      });
      
      cy.get('[data-testid="todo-item"]').first().within(() => {
        cy.get('[data-testid="delete-todo-button"]').click();
      });
      
      // Verify todo is deleted
      cy.get('[data-testid="todo-item"]').should('have.length', 1);
      cy.shouldHaveTodo('Todo to Keep');
      cy.get('[data-testid="todo-item"]').should('not.contain', 'Todo to Delete');
    });

    it('should not delete todo when confirmation is cancelled', () => {
      cy.get('[data-testid="todo-item"]').should('have.length', 2);
      
      // Mock window.confirm to return false
      cy.window().then((win) => {
        cy.stub(win, 'confirm').returns(false);
      });
      
      cy.get('[data-testid="todo-item"]').first().within(() => {
        cy.get('[data-testid="delete-todo-button"]').click();
      });
      
      // Verify todo is not deleted
      cy.get('[data-testid="todo-item"]').should('have.length', 2);
      cy.shouldHaveTodo('Todo to Delete');
      cy.shouldHaveTodo('Todo to Keep');
    });

    it('should show empty state after deleting all todos', () => {
      // Mock window.confirm to return true
      cy.window().then((win) => {
        cy.stub(win, 'confirm').returns(true);
      });
      
      // Delete all todos
      cy.get('[data-testid="delete-todo-button"]').each(($button) => {
        cy.wrap($button).click();
      });
      
      // Verify empty state is shown
      cy.get('[data-testid="empty-state"]').should('be.visible');
      cy.get('[data-testid="todo-item"]').should('not.exist');
    });
  });

  describe('Data Persistence', () => {
    it('should persist todos across page reloads', () => {
      const todoTitle = 'Persistent Todo';
      const todoDescription = 'This should persist after reload';
      
      // Create a todo
      cy.get('[data-testid="title-input"]').type(todoTitle);
      cy.get('[data-testid="description-input"]').type(todoDescription);
      cy.get('[data-testid="add-todo-button"]').click();
      
      // Reload page
      cy.reload();
      
      // Verify todo still exists
      cy.shouldHaveTodo(todoTitle, todoDescription);
    });

    it('should maintain todo completion status after reload', () => {
      // Create and complete a todo
      cy.get('[data-testid="title-input"]').type('Todo to Complete');
      cy.get('[data-testid="add-todo-button"]').click();
      cy.get('[data-testid="toggle-complete-button"]').click();
      
      // Verify completed state
      cy.get('[data-testid="todo-item"]').should('have.class', 'completed');
      
      // Reload page
      cy.reload();
      
      // Verify completion status is maintained
      cy.get('[data-testid="todo-item"]').should('have.class', 'completed');
      cy.get('[data-testid="toggle-complete-button"]').should('contain', 'Undo');
    });
  });

  describe('Error Handling', () => {
    it('should handle API errors gracefully when creating todos', () => {
      // Intercept API request to return error
      cy.intercept('POST', '**/todos', { statusCode: 500 }).as('createTodoError');
      
      cy.get('[data-testid="title-input"]').type('Failed Todo');
      cy.get('[data-testid="add-todo-button"]').click();
      
      cy.wait('@createTodoError');
      
      // Should show error message
      cy.get('[data-testid="error-message"]').should('contain', 'Failed to create todo');
    });

    it('should handle API errors when loading todos', () => {
      // Intercept API request to return error
      cy.intercept('GET', '**/todos', { statusCode: 500 }).as('getTodosError');
      
      cy.reload();
      
      cy.wait('@getTodosError');
      
      // Should show error message
      cy.get('[data-testid="error-message"]').should('contain', 'Failed to load todos');
    });
  });
});
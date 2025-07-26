const request = require('supertest');
const { app } = require('../server');

describe('API Test Suite', () => {
  let authToken;
  let testTodoId;

  // Test user credentials
  const validCredentials = {
    username: 'admin',
    password: 'password123'
  };

  const invalidCredentials = {
    username: 'invalid',
    password: 'wrongpassword'
  };

  describe('POST /login', () => {
    describe('Positive Test Cases', () => {
      it('should login successfully with valid credentials', async () => {
        const response = await request(app)
          .post('/login')
          .send(validCredentials)
          .expect(200);

        expect(response.body).toHaveProperty('message', 'Login successful');
        expect(response.body).toHaveProperty('token');
        expect(response.body).toHaveProperty('user');
        expect(response.body.user).toHaveProperty('id');
        expect(response.body.user).toHaveProperty('username', 'admin');
        expect(response.body.user).toHaveProperty('email');

        // Store token for subsequent tests
        authToken = response.body.token;
      });
    });

    describe('Negative Test Cases', () => {
      it('should fail login with invalid username', async () => {
        const response = await request(app)
          .post('/login')
          .send(invalidCredentials)
          .expect(401);

        expect(response.body).toHaveProperty('error', 'Invalid credentials');
      });

      it('should fail login with invalid password', async () => {
        const response = await request(app)
          .post('/login')
          .send({
            username: 'admin',
            password: 'wrongpassword'
          })
          .expect(401);

        expect(response.body).toHaveProperty('error', 'Invalid credentials');
      });

      it('should fail login with missing username', async () => {
        const response = await request(app)
          .post('/login')
          .send({ password: 'password123' })
          .expect(400);

        expect(response.body).toHaveProperty('error', 'Username and password are required');
      });

      it('should fail login with missing password', async () => {
        const response = await request(app)
          .post('/login')
          .send({ username: 'admin' })
          .expect(400);

        expect(response.body).toHaveProperty('error', 'Username and password are required');
      });

      it('should fail login with empty request body', async () => {
        const response = await request(app)
          .post('/login')
          .send({})
          .expect(400);

        expect(response.body).toHaveProperty('error', 'Username and password are required');
      });
    });
  });

  describe('GET /todos', () => {
    describe('Positive Test Cases', () => {
      it('should get todos for authenticated user', async () => {
        const response = await request(app)
          .get('/todos')
          .set('Authorization', `Bearer ${authToken}`)
          .expect(200);

        expect(Array.isArray(response.body)).toBe(true);
        expect(response.body.length).toBeGreaterThanOrEqual(0);
        
        if (response.body.length > 0) {
          expect(response.body[0]).toHaveProperty('id');
          expect(response.body[0]).toHaveProperty('title');
          expect(response.body[0]).toHaveProperty('completed');
          expect(response.body[0]).toHaveProperty('userId');
        }
      });
    });

    describe('Negative Test Cases', () => {
      it('should fail to get todos without authentication token', async () => {
        const response = await request(app)
          .get('/todos')
          .expect(401);

        expect(response.body).toHaveProperty('error', 'Access token required');
      });

      it('should fail to get todos with invalid token', async () => {
        const response = await request(app)
          .get('/todos')
          .set('Authorization', 'Bearer invalid-token')
          .expect(403);

        expect(response.body).toHaveProperty('error', 'Invalid or expired token');
      });

      it('should fail to get todos with malformed authorization header', async () => {
        const response = await request(app)
          .get('/todos')
          .set('Authorization', 'invalid-header-format')
          .expect(401);

        expect(response.body).toHaveProperty('error', 'Access token required');
      });
    });
  });

  describe('POST /todos', () => {
    describe('Positive Test Cases', () => {
      it('should create a new todo with valid data', async () => {
        const newTodo = {
          title: 'Test Todo',
          description: 'This is a test todo item'
        };

        const response = await request(app)
          .post('/todos')
          .set('Authorization', `Bearer ${authToken}`)
          .send(newTodo)
          .expect(201);

        expect(response.body).toHaveProperty('id');
        expect(response.body).toHaveProperty('title', newTodo.title);
        expect(response.body).toHaveProperty('description', newTodo.description);
        expect(response.body).toHaveProperty('completed', false);
        expect(response.body).toHaveProperty('userId');
        expect(response.body).toHaveProperty('createdAt');

        // Store ID for subsequent tests
        testTodoId = response.body.id;
      });

      it('should create a todo with only title (description optional)', async () => {
        const newTodo = {
          title: 'Todo without description'
        };

        const response = await request(app)
          .post('/todos')
          .set('Authorization', `Bearer ${authToken}`)
          .send(newTodo)
          .expect(201);

        expect(response.body).toHaveProperty('title', newTodo.title);
        expect(response.body).toHaveProperty('description', '');
      });
    });

    describe('Negative Test Cases', () => {
      it('should fail to create todo without authentication', async () => {
        const newTodo = {
          title: 'Test Todo',
          description: 'This should fail'
        };

        const response = await request(app)
          .post('/todos')
          .send(newTodo)
          .expect(401);

        expect(response.body).toHaveProperty('error', 'Access token required');
      });

      it('should fail to create todo without title', async () => {
        const newTodo = {
          description: 'Todo without title'
        };

        const response = await request(app)
          .post('/todos')
          .set('Authorization', `Bearer ${authToken}`)
          .send(newTodo)
          .expect(400);

        expect(response.body).toHaveProperty('error', 'Title is required');
      });

      it('should fail to create todo with empty title', async () => {
        const newTodo = {
          title: '',
          description: 'Todo with empty title'
        };

        const response = await request(app)
          .post('/todos')
          .set('Authorization', `Bearer ${authToken}`)
          .send(newTodo)
          .expect(400);

        expect(response.body).toHaveProperty('error', 'Title is required');
      });
    });
  });

  describe('PUT /todos/:id', () => {
    describe('Positive Test Cases', () => {
      it('should update a todo successfully', async () => {
        const updateData = {
          title: 'Updated Test Todo',
          description: 'Updated description',
          completed: true
        };

        const response = await request(app)
          .put(`/todos/${testTodoId}`)
          .set('Authorization', `Bearer ${authToken}`)
          .send(updateData)
          .expect(200);

        expect(response.body).toHaveProperty('id', testTodoId);
        expect(response.body).toHaveProperty('title', updateData.title);
        expect(response.body).toHaveProperty('description', updateData.description);
        expect(response.body).toHaveProperty('completed', updateData.completed);
        expect(response.body).toHaveProperty('updatedAt');
      });

      it('should update only specific fields', async () => {
        const updateData = {
          completed: false
        };

        const response = await request(app)
          .put(`/todos/${testTodoId}`)
          .set('Authorization', `Bearer ${authToken}`)
          .send(updateData)
          .expect(200);

        expect(response.body).toHaveProperty('completed', false);
        expect(response.body).toHaveProperty('title', 'Updated Test Todo'); // Should remain unchanged
      });
    });

    describe('Negative Test Cases', () => {
      it('should fail to update non-existent todo', async () => {
        const updateData = {
          title: 'Updated Title'
        };

        const response = await request(app)
          .put('/todos/non-existent-id')
          .set('Authorization', `Bearer ${authToken}`)
          .send(updateData)
          .expect(404);

        expect(response.body).toHaveProperty('error', 'Todo not found');
      });

      it('should fail to update todo without authentication', async () => {
        const updateData = {
          title: 'Updated Title'
        };

        const response = await request(app)
          .put(`/todos/${testTodoId}`)
          .send(updateData)
          .expect(401);

        expect(response.body).toHaveProperty('error', 'Access token required');
      });
    });
  });

  describe('DELETE /todos/:id', () => {
    describe('Positive Test Cases', () => {
      it('should delete a todo successfully', async () => {
        const response = await request(app)
          .delete(`/todos/${testTodoId}`)
          .set('Authorization', `Bearer ${authToken}`)
          .expect(200);

        expect(response.body).toHaveProperty('message', 'Todo deleted successfully');
        expect(response.body).toHaveProperty('todo');
        expect(response.body.todo).toHaveProperty('id', testTodoId);
      });

      it('should confirm todo is actually deleted', async () => {
        const response = await request(app)
          .delete(`/todos/${testTodoId}`)
          .set('Authorization', `Bearer ${authToken}`)
          .expect(404);

        expect(response.body).toHaveProperty('error', 'Todo not found');
      });
    });

    describe('Negative Test Cases', () => {
      it('should fail to delete non-existent todo', async () => {
        const response = await request(app)
          .delete('/todos/non-existent-id')
          .set('Authorization', `Bearer ${authToken}`)
          .expect(404);

        expect(response.body).toHaveProperty('error', 'Todo not found');
      });

      it('should fail to delete todo without authentication', async () => {
        const response = await request(app)
          .delete('/todos/some-id')
          .expect(401);

        expect(response.body).toHaveProperty('error', 'Access token required');
      });
    });
  });

  describe('Health Check', () => {
    it('should return server health status', async () => {
      const response = await request(app)
        .get('/health')
        .expect(200);

      expect(response.body).toHaveProperty('status', 'OK');
      expect(response.body).toHaveProperty('timestamp');
    });
  });

  describe('404 Handler', () => {
    it('should return 404 for non-existent routes', async () => {
      const response = await request(app)
        .get('/non-existent-route')
        .expect(404);

      expect(response.body).toHaveProperty('error', 'Route not found');
    });
  });
});
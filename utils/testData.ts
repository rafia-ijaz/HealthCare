export const TEST_CREDENTIALS = {
  STANDARD_USER: {
    username: 'standard_user',
    password: 'secret_sauce'
  },
  LOCKED_OUT_USER: {
    username: 'locked_out_user',
    password: 'secret_sauce'
  },
  PROBLEM_USER: {
    username: 'problem_user',
    password: 'secret_sauce'
  },
  PERFORMANCE_GLITCH_USER: {
    username: 'performance_glitch_user',
    password: 'secret_sauce'
  }
};

export const CHECKOUT_INFO = {
  VALID: {
    firstName: 'John',
    lastName: 'Doe',
    postalCode: '12345'
  },
  EMPTY_FIELDS: {
    firstName: '',
    lastName: '',
    postalCode: ''
  }
};

export const ERROR_MESSAGES = {
  LOCKED_OUT: 'Epic sadface: Sorry, this user has been locked out.',
  INVALID_CREDENTIALS: 'Epic sadface: Username and password do not match any user in this service',
  REQUIRED_FIELDS: 'Error: First Name is required'
};
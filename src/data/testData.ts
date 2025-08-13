export const TEST_DATA = {
  VALID_USERS: {
    STANDARD_USER: {
      username: 'standard_user',
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
  },
  INVALID_USERS: {
    LOCKED_OUT_USER: {
      username: 'locked_out_user',
      password: 'secret_sauce'
    }
  },
  CHECKOUT_INFO: {
    VALID: {
      firstName: 'John',
      lastName: 'Doe',
      postalCode: '12345'
    },
    INVALID: {
      firstName: '',
      lastName: '',
      postalCode: ''
    }
  },
  ERROR_MESSAGES: {
    LOCKED_OUT: 'Epic sadface: Sorry, this user has been locked out.',
    INVALID_CREDENTIALS: 'Epic sadface: Username and password do not match any user in this service',
    FIRST_NAME_REQUIRED: 'Error: First Name is required',
    LAST_NAME_REQUIRED: 'Error: Last Name is required',
    POSTAL_CODE_REQUIRED: 'Error: Postal Code is required'
  },
  PRODUCT_COUNT: 6,
  RANDOM_PRODUCTS_TO_ADD: 3
};
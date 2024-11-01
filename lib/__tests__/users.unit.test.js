// This file is used to test business logic in our users.js file. It is not
// intended to test the integration with the database. We use jest.mock to mock
// responses from the database.

const User = require('../../models/User');
const db = require('../db');

jest.mock('../db', () => ({
  query: jest.fn(),
}));

// As an example, here we check the logic in users.js and not the data we
// actually receive from the database.
describe('User Creation', () => {
  test('should throw an error if required fields are missing', async () => {
    const newUser = {
      username: '',
      email: '',
      password: '' 
    };
    await expect(User.create(newUser)).rejects.toThrow('Username, email, and password are required');
  });
});
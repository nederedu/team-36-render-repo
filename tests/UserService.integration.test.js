const db = require('../lib/db');
const User = require('../models/User');
const { createUser } = require('../services/UserService');

describe('User Creation', () => {
    let testUserData;
    beforeAll(async () => {
        testUserData = {
            username: 'test',
            email: 'test',
            password: 'test',
            first_name: null,
            last_name: null,
        }
    });
    
    afterAll(async () => {
      await db.$disconnect();
    });

    test('should create a new user object', async () => {
        const result = await createUser('test', 'test', 'test');
  
        expect(result).toBeDefined();
        expect(result).toHaveProperty('id');
        expect(result.username).toBe(testUserData.username);
        expect(result.email).toBe(testUserData.email);
        expect(result.password).toBe(testUserData.password);
        expect(result.first_name).toBe(testUserData.first_name);
        expect(result.last_name).toBe(testUserData.last_name);
    });
});
const db = require('../lib/db');
const User = require('../models/User');

describe('User Class', () => {
  afterAll(async () => {
    await db.$disconnect();
  });

  describe('User creation', () => {
    let testUserData;

    beforeAll(async () => {
      testUserData = {
        id: null,
        username: 'testuser1',
        email: 'testuser1@example.org',
        password: 'password1',
        first_name: null,
        last_name: null,
      };
    });

    afterAll(async () => {
      await db.users.deleteMany({
        where: { email: 'testuser1@example.org' },
      });
    });

    test('should create a new user object', async () => {
      const newUser = new User(testUserData);
      const result = await User.create(testUserData);

      expect(result).toBeDefined();
      expect(result).toEqual(newUser);
    });

    test('should store user in database', async () => {
      const newUser = await User.create(testUserData);
      const result = await newUser.store();

      expect(result).toBeDefined();
      expect(result).toEqual(newUser);
    });
    
    test('should store new data for an existing user', async () => {
      const newUserData = {
        id: null,
        username: 'testuser2',
        email: 'testuser2@example.org',
        password: 'deadbeef',
        first_name: 'test',
        last_name: 'user2',
      };

      const newUser = await User.create(newUserData);
      await newUser.store();

      const result = await db.users.findUnique({
        where: { email: newUserData.email },
      });

      expect(result).toBeDefined();
      expect(result).toHaveProperty('id');
      expect(result.username).toBe(newUser.username);
      expect(result.email).toBe(newUser.email);
      expect(result.password).toBe(newUser.password);
      expect(result.first_name).toBe(newUser.first_name);
      expect(result.last_name).toBe(newUser.last_name);
    });
  });

  describe('User queries', () => {
    let adminUser;

    beforeAll(async () => {
      adminUser = new User({
        id: 1,
        username: 'admin',
        email: 'admin@example.org',
        password: 'password',
        first_name: null,
        last_name: null,
      });
    });

    test('should return a user when a valid ID is provided', async () => {
      const user = await User.getById(1);

      expect(user).toBeDefined();
      expect(user).toEqual(adminUser);
    });

    test('should return a user when a valid username is provided', async () => {
      const user = await User.getByUsername('admin');

      expect(user).toBeDefined();
      expect(user).toEqual(adminUser);
    });

    test('should return a user when a valid email is provided', async () => {
      const user = await User.getByEmail('admin@example.org');

      expect(user).toBeDefined();
      expect(user).toEqual(adminUser);
    });
    
    test('should return undefined if no user is found', async () => {
      const user = await User.getById(999);
      expect(user).toBeUndefined();
    });
  });
});
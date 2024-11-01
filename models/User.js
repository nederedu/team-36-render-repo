const db = require('../lib/db');

class User {
  constructor({ id, username, email, password, first_name, last_name }) {
    this.id,
    this.username = username;
    this.email = email;
    this.password = password;
    this.first_name = first_name;
    this.last_name = last_name;
  }

  /**
   * Creates a new user object
   * @param {string} username username
   * @param {string} email email address
   * @param {string} password plaintext password
   * @returns {Promise<object>} User object
   * @throws Throws error if username is taken or query fails
   */
  static async create({ id, username, email, password, first_name, last_name }) {
    if (!username || !email || !password) {
      throw Error("Username, email, and password are required");
    }
    return new this({ id, username, email, password, first_name, last_name });
  }

  /**
   * Stores a user object in the database
   * @returns {Promise<object>} User object
   * @throws Throws error if username is taken or query fails
   */
   async store() {
    const userData = await db.users.upsert({
      where: { email: this.email },
      update: {
        username: this.username,
        password: this.password,
        first_name: this.first_name,
        last_name: this.last_name,
      },
      create: {
        username: this.username,
        email: this.email,
        password: this.password,
        first_name: this.first_name,
        last_name: this.last_name,
      },
    });
    Object.assign(this, userData);
    return this;
  }

  /**
   * Gets user by id
   * @param {number} userId user id
   * @returns {Promise<object>} User object or undefined
   * @throws Throws error if query fails
   */
  static async getById(userId) {
    try {
      const userData = await db.users.findUnique({ where: { id: userId } });
      return userData ? new User(userData) : undefined;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Gets user by username
   * @param {string} username username
   * @returns {Promise<object>} User object or undefined
   * @throws Throws error if query fails
   */
   static async getByUsername(username) {
    try {
      const userData = await db.users.findUnique({ where: { username } });
      return userData ? new User(userData) : undefined;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Gets user by email
   * @param {string} email user id
   * @returns {Promise<object>} User object or undefined
   * @throws Throws error if query fails
   */
  static async getByEmail(email) {
    try {
      const userData = await db.users.findUnique({ where: { email } });
      return userData ? new User(userData) : undefined;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Sets the username
   * @param {string} username username
   * @returns {Promise<object>} User object
   * @throws Throws error if username is taken or query fails
   */
   async setUsername(username) {
    this.username = username;
    return this;
  }

  /**
   * Sets the email
   * @param {string} email email
   * @returns {Promise<object>} User object
   * @throws Throws error if username is taken or query fails
   */
   async setEmail(email) {
    this.email = email;
    return this;
  }

  /**
   * Sets the password
   * @param {string} password password
   * @returns {Promise<object>} User object
   * @throws Throws error if username is taken or query fails
   */
   async setPassword(password) {
    this.password = password;
    return this;
  }

  /**
   * Sets the first name
   * @param {string} first_name first name
   * @returns {Promise<object>} User object
   * @throws Throws error if username is taken or query fails
   */
   async setFirstName(first_name) {
    this.first_name = first_name;
    return this;
  }

  /**
   * Sets the last name
   * @param {string} last_name last name
   * @returns {Promise<object>} User object
   * @throws Throws error if username is taken or query fails
   */
   async setLastName(last_name) {
    this.last_name = last_name;
    return this;
  }
  
  // Method to delete the user permanently
  async delete() {
    await db.users.delete({ where: { id: this.id } });
    return true;
  }
}

module.exports = User;
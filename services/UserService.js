const User = require('../models/User');

// Function to create a new user
export async function createUser(username, email, password) {
    const user = await User.create({ username, email, password });
    await user.store();

    return user;
}

module.exports = { createUser };
const User = require('../../models/User');
const { verifyPassword } = require('../../lib/auth');

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    const {
        username,
        email,
        firstName,
        lastName,
        dateOfBirth,
        currentPassword,
        newPassword,
    } = req.body;

    try {
        // Fetch the user by ID
        const user = await User.getByEmail(email);

        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        // Verify the plain-text password
        const isPasswordValid = await verifyPassword(currentPassword, user.password);
        if (!isPasswordValid) {
            return res.status(403).json({ message: 'Incorrect current password.' });
        }

        // Update user fields
        if (username) {
            await user.setUsername(username);
        }
        if (email) {
            await user.setEmail(email);
        }
        if (firstName) {
            await user.setFirstName(firstName);
        }
        if (lastName) {
            await user.setLastName(lastName);
        }
        if (dateOfBirth) {
            user.date_of_birth = new Date(dateOfBirth); // Directly set the field if no setter is available
        }
        if (newPassword) {
            await user.setPassword(newPassword); // Store plain-text password for now
        }

        // Save the updated user in the database
        await user.store();

        res.status(200).json({ message: 'Account updated successfully.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error.' });
    }
}
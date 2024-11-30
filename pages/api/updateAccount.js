const User = require('../../models/User'); // Adjust the path to your User model
const { verifyPassword } = require('../../lib/auth'); // Use the updated auth logic for plaintext passwords

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    const {
        firstName,
        lastName,
        dateOfBirth,
        email,
        currentPassword,
        newPassword,
    } = req.body;

    const userId = 1; // Replace with actual user ID from session or token

    try {
        // Fetch the user by ID
        const user = await User.getById(userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        // Verify the plain-text password
        const isPasswordValid = await verifyPassword(currentPassword, user.password);
        if (!isPasswordValid) {
            return res.status(403).json({ message: 'Incorrect current password.' });
        }

        // Update user fields
        if (firstName) {
            await user.setFirstName(firstName);
        }
        if (lastName) {
            await user.setLastName(lastName);
        }
        if (dateOfBirth) {
            user.date_of_birth = new Date(dateOfBirth); // Directly set the field if no setter is available
        }
        if (email) {
            await user.setEmail(email);
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
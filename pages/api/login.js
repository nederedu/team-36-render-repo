const User = require('../../models/User');
const { generateToken, setCookie } = require('../../lib/session');
const { verifyPassword } = require('../../lib/auth');

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    const { email, password } = req.body;

    try {
        // Fetch the user by email
        const user = await User.getByEmail(email);

        if (!user) {
            console.error('User not found:', email);
            return res.status(401).json({ message: 'Invalid email or password.' });
        }

        // Verify the password
        const isPasswordValid = await verifyPassword(password, user.password);
        if (!isPasswordValid) {
            console.error('Invalid password for user:', email);
            return res.status(401).json({ message: 'Invalid email or password.' });
        }

        // Generate a JWT with user data
        const token = generateToken({ id: user.id, email: user.email });
        console.log('Generated Token:', token);

        // Set the token as a cookie
        setCookie(res, token);
        console.log('Token set as cookie successfully.');

        return res.status(200).json({ message: 'Login successful.' });
    } catch (error) {
        console.error('Internal Server Error:', error);
        return res.status(500).json({ message: 'Internal server error.' });
    }
}
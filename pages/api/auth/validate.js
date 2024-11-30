import jwt from 'jsonwebtoken';

const SECRET_KEY = process.env.JWT_SECRET || 'your_secret_key';

function verifyToken(token) {
    try {
        return jwt.verify(token, SECRET_KEY);
    } catch (error) {
        throw new Error('Invalid or expired token');
    }
}

export default function handler(req, res) {
    const token = req.cookies.user_token;

    if (!token) {
        return res.status(401).json({ message: 'Unauthorized: No token found.' });
    }

    try {
        const user = verifyToken(token);
        return res.status(200).json({ user });
    } catch (error) {
        console.error('Token verification failed:', error.message);
        return res.status(401).json({ message: 'Unauthorized: Invalid or expired token.' });
    }
}
const { clearCookie } = require('../../lib/session');

export default function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    clearCookie(res);
    res.status(200).json({ message: 'Logout successful.' });
}
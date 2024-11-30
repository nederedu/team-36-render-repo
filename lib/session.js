import jwt from 'jsonwebtoken';
import { serialize } from 'cookie';

const SECRET_KEY = process.env.JWT_SECRET || 'your_secret_key';
const COOKIE_NAME = 'user_token';
const COOKIE_OPTIONS = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/',
};

/**
 * Generate a JWT for the user.
 * @param {object} payload - User data to encode into the token.
 * @param {string} expiresIn - Expiration time (e.g., '1h', '7d').
 * @returns {string} JWT token.
 */
export const generateToken = (payload, expiresIn = '7d') => {
    return jwt.sign(payload, SECRET_KEY, { expiresIn });
};

/**
 * Verify a JWT.
 * @param {string} token - The token to verify.
 * @returns {object} Decoded token payload.
 * @throws Will throw an error if the token is invalid or expired.
 */
export const verifyToken = (token) => {
    return jwt.verify(token, SECRET_KEY);
};

/**
 * Set a cookie with the JWT.
 * @param {object} res - The HTTP response object.
 * @param {string} token - The JWT token.
 */
export const setCookie = (res, token) => {
    const serialized = serialize(COOKIE_NAME, token, COOKIE_OPTIONS);
    res.setHeader('Set-Cookie', serialized);
};

/**
 * Clear the session cookie.
 * @param {object} res - The HTTP response object.
 */
export const clearCookie = (res) => {
    const serialized = serialize(COOKIE_NAME, '', {
        ...COOKIE_OPTIONS,
        maxAge: 0, // Expire the cookie immediately
    });
    res.setHeader('Set-Cookie', serialized);
};
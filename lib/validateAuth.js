import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';

const SECRET_KEY = process.env.JWT_SECRET;

if (!SECRET_KEY) {
  throw new Error('Missing JWT_SECRET in environment variables');
}

export async function authenticateUser() {
  try {
    const cookieStore = await cookies();
    const tokenCookie = cookieStore.get('user_token');

    if (!tokenCookie) {
      return { user: null };
    }

    const token = tokenCookie.value;
    const user = jwt.verify(token, SECRET_KEY);

    return { user };
  } catch (error) {
    console.error('Authentication failed:', error.message);
    return { user: null };
  }
}
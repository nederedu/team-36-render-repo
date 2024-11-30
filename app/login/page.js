import { redirect } from 'next/navigation';
import { authenticateUser } from '../../lib/validateAuth';
import LoginClient from './LoginClient';

export default async function LoginPage() {
  const { user } = await authenticateUser();

  if (user) {
    redirect('/patient'); // Redirect logged-in users to /patient
  }

  return <LoginClient />;
}
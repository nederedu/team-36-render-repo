import { redirect } from 'next/navigation';
import { authenticateUser } from '../lib/validateAuth';

export default async function Home() {
  const { user } = await authenticateUser();

  if (user) {
    redirect('/patient'); // Redirect logged-in users to the patient dashboard
  } else {
    redirect('/login'); // Redirect logged-out users to the login page
  }
}
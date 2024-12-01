import { redirect } from 'next/navigation';
import { authenticateUser } from '../lib/validateAuth';

export default async function Home() {
  const { user } = await authenticateUser();

  if (user) {
    redirect('/patient');
  } else {
    redirect('/login');
  }
}
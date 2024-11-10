import { redirect } from 'next/navigation';

export default function Home() {
  redirect('/login'); // Redirects any access to "/" to "/login"
}
// app/login/page.js

"use client";  // Marks this as a client component

import Head from 'next/head';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    const res = await fetch('/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    if (res.ok) {
      // Redirect to /patient on successful login
      router.push('/patient');
    } else {
      const data = await res.json();
      setError(data.message); // Set the error message
    }
  };

  return (
    <>
      <Head>
        <title>Login | Team 36 Application</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="container">
        <h1>Login</h1>
        
        {error && <p style={{ color: 'red' }}>{error}</p>} {/* display error message in red */}

        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit">Login</button>
        </form>
      </div>
    </>
  );
}
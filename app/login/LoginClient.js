'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from '../../styles/login.module.css';

export default function LoginClient() {
  const [isLogin, setIsLogin] = useState(true); // Toggle between login and signup
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    dateOfBirth: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const router = useRouter();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!isLogin && formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    const endpoint = isLogin ? '/api/login' : '/api/signup';
    const body = isLogin
      ? { email: formData.email, password: formData.password }
      : formData;

    const res = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (res.ok) {
      if (isLogin) {
        router.push('/patient'); // Redirect to patient page after login
      } else {
        setSuccess('Account created successfully! You can now log in.');
        setFormData({ ...formData, email: '', password: '' });
        setIsLogin(true); // Switch back to login after successful signup
      }
    } else {
      const data = await res.json();
      setError(data.message || 'An error occurred.');
    }
  };

  return (
    <div className={styles.loginPage}>
      <div className={styles.loginContainer}>
        <h1 className={styles.appTitle}>Team 36 - Hypertension Monitor</h1>
        <form className={styles.loginForm} onSubmit={handleSubmit}>
          <h2 className={styles.loginHeading}>
            {isLogin ? 'Log In' : 'Create an Account'}
          </h2>
          {error && <p className={styles.error}>{error}</p>}
          {success && <p className={styles.success}>{success}</p>}
          {!isLogin && (
            <>
              <div className={styles.inputGroup}>
                <label htmlFor="username" className={styles.loginLabel}>
                  Username
                </label>
                <input
                  type="username"
                  id="username"
                  name="username"
                  className={styles.loginInput}
                  placeholder="Enter your username"
                  value={formData.username}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className={styles.inputGroup}>
                <label htmlFor="firstName" className={styles.loginLabel}>
                  First Name
                </label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  className={styles.loginInput}
                  placeholder="Enter your first name"
                  value={formData.firstName}
                  onChange={handleChange}
                  required={!isLogin}
                />
              </div>
              <div className={styles.inputGroup}>
                <label htmlFor="lastName" className={styles.loginLabel}>
                  Last Name
                </label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  className={styles.loginInput}
                  placeholder="Enter your last name"
                  value={formData.lastName}
                  onChange={handleChange}
                  required={!isLogin}
                />
              </div>
              <div className={styles.inputGroup}>
                <label htmlFor="dateOfBirth" className={styles.loginLabel}>
                  Date of Birth
                </label>
                <input
                  type="date"
                  id="dateOfBirth"
                  name="dateOfBirth"
                  value={formData.dateOfBirth}
                  onChange={handleChange}
                />
              </div>
            </>
          )}

          <div className={styles.inputGroup}>
            <label htmlFor="email" className={styles.loginLabel}>
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              className={styles.loginInput}
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="password" className={styles.loginLabel}>
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              className={styles.loginInput}
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          {!isLogin && (
            <div className={styles.inputGroup}>
              <label htmlFor="confirmPassword" className={styles.loginLabel}>
                Confirm Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                className={styles.loginInput}
                placeholder="Confirm your password"
                value={formData.confirmPassword}
                onChange={handleChange}
                required={!isLogin}
              />
            </div>
          )}

          <button type="submit" className={styles.loginButton}>
            {isLogin ? 'Submit' : 'Sign Up'}
          </button>
        </form>

        <p className={styles.switchText}>
          {isLogin ? (
            <>
              Don't have an account?{' '}
              <button
                type="button"
                className={styles.switchButton}
                onClick={() => setIsLogin(false)}
              >
                Sign Up
              </button>
            </>
          ) : (
            <>
              Already have an account?{' '}
              <button
                type="button"
                className={styles.switchButton}
                onClick={() => setIsLogin(true)}
              >
                Log In
              </button>
            </>
          )}
        </p>
      </div>
    </div>
  );
}
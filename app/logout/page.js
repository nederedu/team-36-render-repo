'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function Logout() {
    const router = useRouter();

    useEffect(() => {
        const logout = async () => {
            try {
                const response = await fetch('/api/logout', {
                    method: 'POST',
                });
                if (response.ok) {
                    router.push('/login');
                } else {
                    console.error('Failed to logout:', response.statusText);
                }
            } catch (error) {
                console.error('An error occurred during logout:', error);
            }
        };

        logout();
    }, [router]);

    return <p>Logging you out...</p>; // Optional: Loading state
}
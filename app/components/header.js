'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import styles from '../../styles/header.module.css';

export default function Header() {
    const handleDropdownToggle = (event) => {
        const dropdown = document.getElementById("profileDropdown");
        if (dropdown.style.display === "block") {
            dropdown.style.display = "none";
        } else {
            dropdown.style.display = "block";
        }
    };

    const handleClickOutside = (event) => {
        const dropdown = document.getElementById("profileDropdown");
        const button = document.getElementById("profileButton");
        if (
            dropdown &&
            button &&
            !dropdown.contains(event.target) &&
            !button.contains(event.target)
        ) {
            dropdown.style.display = "none";
        }
    };

    useEffect(() => {
        window.addEventListener("click", handleClickOutside);
        return () => {
            window.removeEventListener("click", handleClickOutside);
        };
    }, []);

    return (
        <header className={styles.header}>
            <div className={styles.headerLeft}>
                <h1>Team 36 - Hypertension Monitor</h1>
            </div>
            <div className={styles.headerRight}>
                <div className={styles.profile}>
                    <Link href="/fhir-requests">
                        <button className={styles.button}>View FHIR Requests</button>
                    </Link>
                    <Link href="/patient">
                        <button className={styles.button}>Dashboard</button>
                    </Link>
                    <button
                        id="profileButton"
                        onClick={handleDropdownToggle}
                        className={styles.profileButton}
                    >
                        Profile
                    </button>
                    <div
                        id="profileDropdown"
                        className={styles.dropdown}
                        style={{ display: "none" }}
                    >
                        <Link href="/account">
                            <button className={styles.button}>Account Settings</button>
                        </Link>
                        <Link href="/logout">
                            <button className={styles.button}>Logout</button>
                        </Link>
                    </div>
                </div>
            </div>
        </header>
    );
}
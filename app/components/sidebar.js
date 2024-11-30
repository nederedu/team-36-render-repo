'use client';

import styles from "../../styles/sidebar.module.css";

export default function Sidebar({ patient }) {

    return (
        <div className={styles.sidebar}>
            <h1>{patient.first_name} {patient.last_name}</h1>
            <h2>MRN: {patient.mrn}</h2>
            <h2>DOB: {patient.date_of_birth}</h2>
        </div>
    );
}
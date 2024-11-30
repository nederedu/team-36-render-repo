'use client';

import styles from '../../styles/layout.module.css';

export default function ReadingsTable({ readings }) {
    return (
        <div className={styles.graph}>
            <h1>Historical Readings</h1>
            <table className={styles.readings_table}> 
                <thead>
                    <tr>
                        <th>Instant of Reading</th>
                        <th>Blood Pressure (mmHg)</th>
                    </tr>
                </thead>
                <tbody>
                    {readings.map((reading) => (
                        <tr key={reading.id}>
                            <td>{reading.formattedDate}</td>
                            <td>{reading.value}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
'use client'

import { Children } from "react"
import { useState } from "react";
import styles from "../../styles/styles.module.css"


export default function BPform({Children}) {

    const [patient_id, setPatientID] = useState(1);
    const [value, setValue] = useState('');
    const [date, setDate] = useState('');
    const [time, setTime] = useState('');
    const [error, setError] = useState('');

    async function storeValue(event) {
        const response = await fetch('/api/observation', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({patient_id, value, date, time}),
        });

        if (response.ok) {
            // Redirect to /patient on successful login
            window.location.reload();
        } else {
            const data = await response.json();
            setError(data.message); // Set the error message
        }
    };
    
    return (
        <form className={styles.entry_form} onSubmit={storeValue}> 
            <label htmlFor="date">Date:</label>
            <input 
                type="date" 
                id="date" 
                name="date" 
                onChange={(event) => setDate(event.target.value) }
                required></input>
            <label htmlFor="time">     Time:</label>
            <input type="time" 
                id="time" 
                name="time" 
                onChange={(event) => setTime(event.target.value) }
                required></input>
            <label htmlFor="bp">     Blood Pressure:</label>
            <input type="text" 
                id="bp" 
                name="bp" 
                pattern="[0-9]{1,3}\/[0-9]{1,3}" 
                onChange={(event) => setValue(event.target.value) }
                required></input>
            <input type="submit" value="Submit"></input>
        </form>
);
}
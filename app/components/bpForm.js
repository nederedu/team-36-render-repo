'use client';

import { useState } from 'react';
import styles from '../../styles/form.module.css';

export default function BPFormClient({ patient_id }) {
  const [value, setValue] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [error, setError] = useState('');

  async function storeValue(event) {
    event.preventDefault(); // Prevent default form submission behavior

    const response = await fetch('/api/observation', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ patient_id, value, date, time }),
    });

    if (response.ok) {
      // Reload the page or handle success logic
      console.log("WERE OK!");
      window.location.reload();
    } else {
      const data = await response.json();
      setError(data.message); // Display the error message
    }
  }

  return (
    <div className={styles.data_entry}>
      <h1>Enter a New Reading</h1>
      {error && <p className={styles.error}>{error}</p>}
      <form className={styles.entry_form} onSubmit={storeValue}>
        <label htmlFor="date">Date:</label>
        <input
          type="date"
          id="date"
          name="date"
          onChange={(event) => setDate(event.target.value)}
          required
        />
        <label htmlFor="time">Time:</label>
        <input
          type="time"
          id="time"
          name="time"
          onChange={(event) => setTime(event.target.value)}
          required
        />
        <label htmlFor="bp">Blood Pressure:</label>
        <input
          type="text"
          id="bp"
          name="bp"
          pattern="[0-9]{1,3}\/[0-9]{1,3}" // Validation pattern for blood pressure
          onChange={(event) => setValue(event.target.value)}
          required
        />
        <input type="submit" value="Submit" />
      </form>
    </div>
  );
}
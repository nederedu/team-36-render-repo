import pool from '../lib/db';
import Image from "next/image";
import styles from "../styles/styles.module.css";

export default function Home() {
  return (
    <div className={styles.page}>

      <div className={styles.sidebar}>
        <h1>Patient Name</h1> 
        <h2>Patient ID:</h2>
        <h2>Age and gender:</h2>
        <h2>DOB:</h2>
      </div>
      <main className={styles.main}>
        <div className={styles.data_entry}>
            <h1>Enter a New Reading</h1>
            <form className={styles.entry_form}>
                <label for="date">Date:</label>
                <input type="date" id="date" name="date"></input>
                <label for="time">     Time:</label>
                <input type="time" id="time" name="time"></input>
                <label for="bp">     Blood Pressure:</label>
                <input type="text" id="bp" name="bp"></input> {/*Add data validation for BP*/}
                <input type="submit" value="Submit"></input>
            </form>
            
        </div>
        <div className={styles.graph}>
            <h1>Historical Readings</h1>
        </div>
      </main>
    </div>
  );
}

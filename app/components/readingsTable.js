//'use client'

import { Children } from "react"
//import { useState, useEffect } from "react";
import styles from "../../styles/styles.module.css"
import Observation from "../../models/Observation";


export default async function ReadingsTable({Children}) {
    //const [readings, setReadings] = useState([]);
    const current_pat_id = 1;

    const readings = await Observation.getObsForPat(current_pat_id);

    function formatDate(inst) {
        const readingInst = new Intl.DateTimeFormat('en-US', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: "numeric",
            minute: "numeric",
            second: "numeric",
        }).format(inst)

        return readingInst;
    }

    return (
        <div>
             <table className={styles.readings_table}> 
                <thead>
                <tr>
                    <th>Date & Time</th>
                    <th>Blood Pressure (mmHg)</th>
                </tr>
                </thead>
                <tbody>
                    {readings.map((reading) => (
                        <tr key={reading.id}>
                            <td>{formatDate(reading.observation_instant)}</td>
                            <td>{reading.value}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}

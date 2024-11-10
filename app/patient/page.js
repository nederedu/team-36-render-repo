const Patient = require('../../models/Patient');
import styles from "../../styles/styles.module.css";
import BPform from "../components/bpForm";
import ReadingsTable from "../components/readingsTable";

export default async function Home() {

    const current_pat_id = 1;

    const current_patient = await Patient.getById(current_pat_id);
    const dob = new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
    }).format(current_patient.date_of_birth)

    return (
        <div className={styles.page}>

            <div className={styles.sidebar}>
                <h1>{current_patient.first_name} {current_patient.last_name}</h1> 
                <h2>MRN: {current_patient.mrn}</h2>
                <h2>DOB: {dob}</h2>
            </div>
            <main className={styles.main}>
                <div className={styles.data_entry}>
                    <h1>Enter a New Reading</h1>
                    <BPform />                    
                </div>
                <div className={styles.graph}>
                    <h1>Historical Readings</h1>
                    <ReadingsTable />
                </div>
            </main>
        </div>
    );
}

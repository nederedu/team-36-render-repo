import { authenticateUser } from '../../lib/validateAuth';
import Patient from '../../models/Patient';
import Observation from '../../models/Observation';
import styles from '../../styles/patient.module.css';
import Header from '../components/header';
import Sidebar from '../components/sidebar';
import BPform from '../components/bpForm';
import ReadingsTable from '../components/readingsTable';
import { redirect } from 'next/navigation';
import { format } from 'date-fns';

export default async function PatientPage() {
    const { user } = await authenticateUser();

    if (!user) {
        redirect('/login');
    }

    const current_patient = await Patient.getByUserId(user.id);
    const plain_patient = current_patient.toPlainObject();

    const raw_readings = await Observation.getObsForPat(current_patient.id);
    const readings = raw_readings.map((reading) => ({
            ...reading,
            formattedDate: format(new Date(reading.observation_instant), 'MM/dd/yyyy, hh:mm:ss a'),
        }))
        .sort((a, b) => new Date(b.observation_instant) - new Date(a.observation_instant));

    return (
        <div className={styles.page}>
            {/* Header */}
            <Header />

            {/* Sidebar */}
            <Sidebar patient={plain_patient} />

            {/* Main Content */}
            <main className={styles.main}>
                <BPform patient_id={current_patient.id} />
                <ReadingsTable readings={readings} />
            </main>
        </div>
    );
}
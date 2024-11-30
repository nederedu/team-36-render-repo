import { authenticateUser } from '../../lib/validateAuth';
import Patient from '../../models/Patient';
import AccountSettingsClient from './AccountSettingsClient';
import styles from '../../styles/layout.module.css';
import { redirect } from 'next/navigation';

export default async function AccountPage() {
    const { user } = await authenticateUser();

    if (!user) {
        redirect('/login'); // Redirect unauthorized users to login page
    }

    const patientInstance = await Patient.getByUserId(user.id);
    const patient = patientInstance ? patientInstance.toPlainObject() : null;

    return (
        <div className={styles.page}>
            {/* Pass authenticated patient data to the client-side component */}
            <AccountSettingsClient patient={patient} />
        </div>
    );
}
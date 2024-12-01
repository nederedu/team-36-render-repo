import path from 'path';
import fs from 'fs/promises';
import { authenticateUser } from '../../lib/validateAuth';
import CollapsibleJson from './FhirRequestsClient.js';
import styles from '../../styles/fhirDisplay.module.css';
import Link from 'next/link';
import { redirect } from 'next/navigation';
const Patient = require('../../models/Patient');

async function fetchFhirData(patientId) {
  const filepath = path.resolve('./data/saved_observations.ndjson');
  
  try {
    await fs.access(filepath);
    const fhirData = await fs.readFile(filepath, 'utf8');
    return fhirData
      .split('\n') // Split file into lines
      .filter((line) => line.trim() !== '') // Remove empty lines
      .map((line) => JSON.parse(line)) // Parse JSON objects
      .filter((entry) => entry.subject && entry.subject.reference === `Patient/${patientId}`); // Filter by patient ID
  } catch (err) {
    if (err.code === 'ENOENT') {
      console.warn(`File not found: ${filepath}. Returning an empty array.`);
    } else {
      console.error('Error reading FHIR data:', err);
    }
    return [];
  }
}

export default async function FhirDisplay() {
  const { user } = await authenticateUser();

  if (!user) {
    redirect('/login'); // Redirect unauthorized users to login page
  }

  const patient = await Patient.getByUserId(user.id);
  const patientId = patient.id;

  const fhirObjects = await fetchFhirData(patientId);

  return (
    <div className={styles.page}>
      {/* Main Content */}
      <main className={styles.main}>
        <div className={styles.topBar}>
          <Link href="/patient">
            <button className={styles.backButton}>Back to Dashboard</button>
          </Link>
        </div>
        <h1 className={styles.pageTitle}>FHIR Requests</h1>
        <div className={styles.fhirContainer}>
          {fhirObjects.length > 0 ? (
            fhirObjects.map((object, index) => (
              <CollapsibleJson key={index} jsonObject={object} />
            ))
          ) : (
            <p>No FHIR data available.</p>
          )}
        </div>
      </main>
    </div>
  );
}
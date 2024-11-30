import path from 'path';
import fs from 'fs/promises';
import { authenticateUser } from '../../lib/validateAuth';
import CollapsibleJson from './FhirRequestsClient.js';
import styles from '../../styles/fhirDisplay.module.css';
import Link from 'next/link';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import { redirect } from 'next/navigation';

async function fetchFhirData() {
  const filepath = path.resolve('./data/saved_observations.ndjson');
  try {
    const fhirData = await fs.readFile(filepath, 'utf8');
    return fhirData
      .split('\n')
      .filter((line) => line.trim() !== '')
      .map((line) => JSON.parse(line));
  } catch (err) {
    return [];
  }
}

export default async function FhirDisplay() {
  const { user } = await authenticateUser();

  if (!user) {
    redirect('/login'); // Redirect unauthorized users to login page
  }

  const fhirObjects = await fetchFhirData();

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
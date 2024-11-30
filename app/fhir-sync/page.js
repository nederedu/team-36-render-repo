import { redirect } from 'next/navigation';
import { syncReadings } from '../../services/ObservationService';

export default async function SyncPage({ searchParams }) {
    //const observationId = searchParams?.observationId;
    const observationId = "1";

    if (!observationId) {
        return (
            <div>
                <h1>Error</h1>
                <p>No observationId provided in the query parameters.</p>
            </div>
        );
    }

    try {
        await syncReadings(observationId);

        // Redirect to a success page or desired route after syncing
        redirect('/patient');
    } catch (error) {
        console.error('Error syncing readings:', error);
        return (
            <div>
                <h1>Error</h1>
                <p>Failed to sync readings. Please try again later.</p>
            </div>
        );
    }
}
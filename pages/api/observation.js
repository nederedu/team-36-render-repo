import Observation, { create, store } from "../../models/Observation";

export default async function storeReading(req, res){

    if (req.method == 'POST') {
        const { patient_id, value, date, time } = req.body;
        try {
            const observation_instant = new Date(date + ' ' + time);

            const obsData = {
                id: '',
                patient_id: patient_id,
                type: 'Blood Pressure',
                value: value,
                unit: 'mmHg',
                observation_instant: observation_instant,
              };

            let newObs = new Observation(obsData);
            // const newObs = Observation.create(obsData);

            const storedObs = await newObs.store();
            
            if ('id' in storedObs) {
                return res.status(200).json({ message: 'New reading stored' });
            }
            else {
                return res.status(401).json({ message: 'Error: Reading not stored' });
            }
        } catch (error) {
            console.error('Error storing observation:', error);
            res.status(500).json({ message: 'Internal error' });
        }
    }

    else {
        return res.status(405).json({message: 'Method not allowed'})
    }
}
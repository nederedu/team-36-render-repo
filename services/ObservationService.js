const Observation = require('../models/Observation');

// Flow for observation entry
export async function createObservation(id, patient_id, type, value, unit, observation_instant) {
    // TODO: Validate user input

    // Create and store Observation object
    const observation = await Observation.create({ id, patient_id, type, value, unit, observation_instant });
    await observation.store();
    
    return observation;
}

module.exports = { createObservation };
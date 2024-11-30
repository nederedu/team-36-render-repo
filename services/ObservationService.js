import { FHIRClient } from "../lib/FHIRClient";
import Observation from "../models/Observation";

export async function createObservation({ id, patient_id, type, value, unit, observation_instant }) {
    // TODO: Validate user input

    // Create and store Observation object
    const observation = await Observation.create({ id, patient_id, type, value, unit, observation_instant });
    await observation.store();

    const [systolic, diastolic] = observation.value.split('/').map(Number);

    const obsResource = await createResource({ obsId: observation.id, patientId: patient_id, systolic: systolic, diastolic: diastolic, unit: unit, effectiveDateTime: observation_instant });
    await FHIRClient.saveResourceToFile(obsResource);
    
    return observation;
}

/**
   * Create a FHIR Observation resource for blood pressure.
   * @param {Object} data - Input data for the Observation resource.
   * @param {Object} data.obsId - The ID of the observation.
   * @param {string} data.patientId - The ID of the patient (e.g., "123").
   * @param {number} data.systolic - Systolic blood pressure value.
   * @param {number} data.diastolic - Diastolic blood pressure value.
   * @param {string} data.unit - Unit for the blood pressure values (e.g., "mmHg").
   * @param {string} data.effectiveDateTime - Observation timestamp.
   * @returns {Object} - The complete FHIR Observation resource.
   */
 export async function createResource({ obsId, patientId, systolic, diastolic, unit, effectiveDateTime }) {
    const observation = {
      resourceType: 'Observation',
      id: obsId,
      status: 'final',
      category: [
        {
          coding: [
            {
              system: 'http://terminology.hl7.org/CodeSystem/observation-category',
              code: 'vital-signs',
              display: 'Vital Signs',
            },
          ],
        },
      ],
      code: {
        coding: [
          {
            system: 'http://loinc.org',
            code: '85354-9',
            display: 'Blood pressure panel',
          },
        ],
        text: 'Blood Pressure',
      },
      subject: {
        reference: `Patient/${patientId}`,
      },
      effectiveDateTime,
      component: [
        {
          code: {
            coding: [
              {
                system: 'http://loinc.org',
                code: '8480-6',
                display: 'Systolic blood pressure',
              },
            ],
            text: 'Systolic Blood Pressure',
          },
          valueQuantity: {
            value: systolic,
            unit,
            system: 'http://unitsofmeasure.org',
            code: 'mm[Hg]',
          },
        },
        {
          code: {
            coding: [
              {
                system: 'http://loinc.org',
                code: '8462-4',
                display: 'Diastolic blood pressure',
              },
            ],
            text: 'Diastolic Blood Pressure',
          },
          valueQuantity: {
            value: diastolic,
            unit,
            system: 'http://unitsofmeasure.org',
            code: 'mm[Hg]',
          },
        },
      ],
    };

    return observation;
  }

/**
 * Fetch and process an Observation resource.
 * @param {string} observationId - The ID of the Observation resource.
 * @returns {Object} - The processed Observation data.
 */
export async function getFhirObservation(observationId) {
    try {
        const observation = await FHIRClient.getResource("Observation", observationId);
        return observation;
    } catch (error) {
        throw new Error(`Error fetching Observation (${observationId}): ${error.message}`);
    }
}

/**
 * Fetch and process an Observation resource.
 * @param {string} observationId - The ID of the Observation resource.
 * @returns {Object} - The processed Observation data.
 */
export async function saveFhirObservation(observationId) {
    try {
        const observation = getFhirObservation(observationId);
        return processFhirObservation(observation);
    } catch (error) {
        throw new Error(`Error fetching Observation (${observationId}): ${error.message}`);
    }
}

/**
 * Process an Observation resource to extract meaningful data.
 * @param {Object} observation - The FHIR Observation resource.
 * @returns {Object} - Extracted Observation data.
 */
export function processFhirObservation(observation) {
    if (!observation || observation.resourceType !== "Observation") {
        throw new Error("Invalid Observation resource");
    }
  
    const systolic = observation.component?.find(
        (comp) => comp.code.coding.some((code) => code.code === "8480-6")
    )?.valueQuantity?.value;
  
    const diastolic = observation.component?.find(
        (comp) => comp.code.coding.some((code) => code.code === "8462-4")
    )?.valueQuantity?.value;
  
    return {
        id: observation.id,
        status: observation.status,
        effectiveDate: observation.effectiveDateTime,
        systolic,
        diastolic,
    };
}

/**
 * Sync external observations
 * @param {string} observationId - The ID of the Observation resource.
 * @returns {Object} - The processed Observation data.
 */
export async function syncReadings(observationId) {
    try {
        const observation = await FHIRClient.getResource("Observation", observationId);

        const patientId = observation.subject?.reference?.split('/')[1] || null;
        const type = observation.code?.coding?.[0]?.display || observation.code?.text || 'Unknown';
        const value = observation.valueQuantity?.value || null;
        const unit = observation.valueQuantity?.unit || null;
        const instant = observation.effectiveDateTime || observation.issued || null;

        const new_observation = await Observation.create({ id: observationId, patient_id: patientId, type, value, unit, observation_instant: instant });
        await new_observation.store();
    } catch (error) {
        throw new Error(`Error fetching Observation (${observationId}): ${error.message}`);
    }
}

export default { createObservation, getFhirObservation, processFhirObservation, syncReadings };
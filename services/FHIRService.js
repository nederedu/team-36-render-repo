import { FHIRClient } from "../lib/FHIRClient";

/**
 * Fetch and process an Observation resource.
 * @param {string} observationId - The ID of the Observation resource.
 * @returns {Object} - The processed Observation data.
 */
export const getObservation = async (observationId) => {
  const resourceType = "Observation";
  try {
    const observation = await FHIRClient.getResource(resourceType, observationId);
    return processObservation(observation);
  } catch (error) {
    throw new Error(`Error fetching Observation (${observationId}): ${error.message}`);
  }
};

/**
 * Process an Observation resource to extract meaningful data.
 * @param {Object} observation - The FHIR Observation resource.
 * @returns {Object} - Extracted Observation data.
 */
const processObservation = (observation) => {
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
};

export const saveObservationFHIR =  async (sysBP, diaBP, patient_id, observation_instant) => {
  const data = {
    resourceType: "Observation",
    id: "1",
    status: "final",
    category: [
      {
        coding: [
          {
            system: "http://terminology.hl7.org/CodeSystem/observation-category",
            code: "vital-signs",
            display: "Vital Signs"
          }
        ]
      }
    ],
    code: {
      coding: [
        {
          system: "http://loinc.org",
          code: "85354-9",
          display: "Blood pressure panel"
        }
      ]
    },
    subject: {
      reference: "Patient/" + patient_id
    },
    effectiveDateTime: observation_instant,
    component: [
      {
        code: {
          coding: [
            {
              system: "http://loinc.org",
              code: "8480-6",
              display: "Systolic blood pressure"
            }
          ]
        },
        valueQuantity: {
          value: sysBP,
          unit: "mmHg",
          system: "http://unitsofmeasure.org",
          code: "mm[Hg]"
        }
      },
      {
        code: {
          coding: [
            {
              system: "http://loinc.org",
              code: "8462-4",
              display: "Diastolic blood pressure"
            }
          ]
        },
        valueQuantity: {
          value: diaBP,
          unit: "mmHg",
          system: "http://unitsofmeasure.org",
          code: "mm[Hg]"
        }
      }
    ]
  };

  try {
    const observation = await FHIRClient.saveResourceToFile(data);
    //return processObservation(observation); //this wasn't working, but it is saving to file, so I removed it for now
    return;
  } catch (error) {
    throw new Error(`Error saving Observation: ${error.message}`);
  }
}
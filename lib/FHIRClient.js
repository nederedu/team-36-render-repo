import fs from 'fs';
import path from 'path';

const FHIR_SERVER_BASE_URL =
  process.env.NEXT_PUBLIC_FHIR_SERVER || "http://host.docker.internal:8080/fhir";

if (!FHIR_SERVER_BASE_URL) {
  throw new Error("FHIR_SERVER_BASE_URL is not defined in environment variables");
}

const MOCK_DATA_PATH = path.resolve('./data/mock_observation_pull.ndjson');
const USE_MOCK_DATA = process.env.USE_MOCK_DATA === "true";

export const FHIRClient = {
  baseUrl: FHIR_SERVER_BASE_URL,

  /**
   * Fetch a resource from the FHIR server or mock file.
   * @param {string} resourceType - The type of FHIR resource (e.g., "Patient").
   * @param {string} resourceId - The ID of the resource.
   * @returns {Promise<Object>} - The fetched FHIR resource.
   */
  getResource: async (resourceType, resourceId) => {
    if (USE_MOCK_DATA) {
      try {
        const mockData = fs.readFileSync(MOCK_DATA_PATH, 'utf-8');
        let obsData;
        obsData = JSON.parse(mockData);
        if (!Array.isArray(obsData)) {
            obsData = [obsData];
        }
        
        const resource = obsData.find(
          item => item.resourceType === resourceType && item.id === resourceId
        );
        if (!resource) {
          throw new Error(`Resource ${resourceType}/${resourceId} not found in mock data`);
        }
        return resource;
      } catch (err) {
        throw new Error(`Error reading mock data: ${err.message}`);
      }
    } else {
      const url = `${FHIR_SERVER_BASE_URL}/${resourceType}/${resourceId}`;
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Failed to fetch resource (${url}): ${response.statusText}`);
      }
      return response.json();
    }
  },

  /**
   * Send a resource to the external FHIR server.
   * @param {string} resourceType - The type of FHIR resource (e.g., "Observation").
   * @param {Object} data - The data for the new FHIR resource.
   * @returns {Promise<Object>} - The response from the FHIR server.
   */
  sendToExternalFhirServer: async (resourceType, data) => {
    const url = `${FHIR_SERVER_BASE_URL}/${resourceType}`;
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/fhir+json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error(`Failed to send resource to FHIR server (${url}): ${response.statusText}`);
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error(`Error sending ${resourceType} to FHIR server:`, error);
      throw error;
    }
  },

  /**
   * Create a new resource on the FHIR server.
   * @param {Object} data - The data for the new FHIR resource.
   * @returns {Promise<Object>} - The created FHIR resource.
   */
  saveResourceToFile: async (data) => {
    const filepath = path.resolve('./data/saved_observations.ndjson');
    const jsonData = JSON.stringify(data);
    if (fs.existsSync(filepath)) {
      fs.appendFileSync(filepath, '\n'+jsonData);
    }
    else {
      fs.writeFileSync(filepath, jsonData);
    }
    
    return jsonData;
  },
};


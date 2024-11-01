const Observation = require('../../models/Observation');
const db = require('../db');

jest.mock('../db', () => ({
  query: jest.fn(),
}));

describe('Observation Creation', () => {
  test('should throw an error if required fields are missing', async () => {
    const newObservation = {
      id: '',
      patient_id: '',
      type: '',
      value: '',
      unit: '',
      observation_instant: '',
    };
    await expect(Observation.create(newObservation)).rejects.toThrow('Patient, type, value, unit, and observation instant are required');
  });
});
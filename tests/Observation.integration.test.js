const db = require('../lib/db');
const Observation = require('../models/Observation');

describe('Observation Class', () => {
  // After all tests are done, clean up
  afterAll(async () => {
    await db.$disconnect();
  });

  describe('Observation Creation', () => {
    let testObsData;

    beforeAll(async () => {
      testObsData = {
        id: 2,
        patient_id: 1,
        type: 'Blood Pressure',
        value: '110/70',
        unit: 'bp',
        observation_instant: '1-1-1991',
      };
    });

    afterAll(async () => {
      await db.observations.deleteMany({
        where: { id: testObsData.id },
      });
    });

    test('should create a new observation object', async () => {
      const newObs = new Observation(testObsData);
      const result = await Observation.create(testObsData);

      expect(result).toBeDefined();
      expect(result).toEqual(newObs);
    });

    test('should store observation in database', async () => {
      const newObservation = await Observation.create(testObsData);
      const result = await newObservation.store();

      expect(result).toBeDefined();
      expect(result).toEqual(newObservation);
    });
    
    test('should store new data for an existing observation', async () => {
      const newObsData = {
        patient_id: 1,
        type: 'Blood Pressure',
        value: '130/90',
        unit: 'bp',
        observation_instant: '1991-01-01',
      };

      const newObservation = await Observation.create(newObsData);
      const result = await newObservation.store();

      expect(result).toBeDefined();
      expect(result).toHaveProperty('id');
      expect(result.patient_id).toBe(newObservation.patient_id);
      expect(result.type).toBe(newObservation.type);
      expect(result.value).toBe(newObservation.value);
      expect(result.unit).toBe(newObservation.unit);
      expect(result.observation_instant).toBe(newObservation.observation_instant);
    });
  });

  describe('Observation Queries', () => {
    let testObservation;

    beforeAll(async () => {
      testObservation = new Observation({
        patient_id: 1,
        type: 'Blood Pressure',
        value: '120/80',
        unit: 'mmHg',
        observation_instant: new Date('1991-01-01'),
      });

    });

    test('should return an observation when a valid ID is provided', async () => {

      const observation = await Observation.getById(1);

      expect(observation).toBeDefined();
      expect(observation.patient_id).toBe(testObservation.patient_id);
      expect(observation.type).toBe(testObservation.type);
      expect(observation.value).toBe(testObservation.value);
      expect(observation.unit).toBe(testObservation.unit);
      expect(observation.observation_instant).toStrictEqual(testObservation.observation_instant);
    });
    
    test('should return undefined if no observation is found', async () => {
      const observation = await Observation.getById(99999);
      expect(observation).toBeUndefined();
    });
  });
});
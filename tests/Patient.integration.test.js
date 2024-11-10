const db = require('../lib/db');
const Patient = require('../models/Patient');

describe('Patient Class', () => {
    // After all tests are done, clean up
    afterAll(async () => {
        await db.$disconnect();
    });
  
    describe('Patient Creation', () => {
        let testPatData;
  
        beforeAll(async () => {
            testPatData = {
                id: 2,
                mrn: '1234',
                first_name: "Jest",
                middle_name: "Mid",
                last_name: "ZZTest",
                date_of_birth: new Date('2021-09-29T00:00'),
                street: "Main St",
                house_number: "123",
                city: "Chicago",
                state: "IL",
                zip: "60618",
                country: "USA",
                phone_number: "5559992222",
                email_address: "zztestpatient@zztest.zztest"
            };
        });
  
        afterAll(async () => {
            await db.patients.deleteMany({
                where: {id: testPatData.id}
            })
        });

        test('should create a new patient object', async () => {
            const newPat = new Patient(testPatData);
            const result = await Patient.create(testPatData);
    
            expect(result).toBeDefined();
            expect(result).toEqual(newPat);
        });

        test('should store patient in database', async () => {
            const newPatient = await Patient.create(testPatData);
            const result = await newPatient.store();
    
            expect(result).toBeDefined();
            expect(result).toEqual(newPatient);
        });

        test('should return a patient when a valid ID is provided', async () => {
            const patient = await Patient.getById(testPatData.id);
            
            expect(patient).toBeDefined();
            expect(patient.id).toBe(testPatData.id);
            expect(patient.mrn).toBe(testPatData.mrn);
            expect(patient.first_name).toBe(testPatData.first_name);
            expect(patient.last_name).toBe(testPatData.last_name);
        });

        test('should return a patient when a valid MRN is provided', async () => {
            const patient = await Patient.getByMRN('1234');
      
            expect(patient).toBeDefined();
            expect(patient.id).toBe(testPatData.id);
            expect(patient.mrn).toBe(testPatData.mrn);
            expect(patient.first_name).toBe(testPatData.first_name);
            expect(patient.last_name).toBe(testPatData.last_name);
        });
          
        test('should return undefined if no patient is found by ID', async () => {
            const patient = await Patient.getById(999);
            expect(patient).toBeUndefined();
        });

        test('should return undefined if no patient is found by MRN', async () => {
            const patient = await Patient.getByMRN("999");
            expect(patient).toBeUndefined();
        });
    });
});
    
      
  
const db = require('../lib/db');
const crypto = require('crypto');
const { runInThisContext } = require('vm');

class Patient {
    constructor({id, mrn, first_name, middle_name, last_name, date_of_birth, street, house_number, city, state, zip, country, phone, email}) {
        this.id = id;
        this.mrn = mrn;
        this.first_name = first_name;
        this.middle_name = middle_name;
        this.last_name = last_name;
        this.date_of_birth = date_of_birth;
        this.street = street;
        this.house_number = house_number;
        this.city = city;
        this.state = state;
        this.zip = zip;
        this.country = country;
        this.phone = phone;
        this.email = email;
    }

    toPlainObject() {

        const dob = new Date(this.date_of_birth);
        const isoDOB = dob.toISOString().split('T')[0];
        const dobYear = isoDOB.split('-')[0];
        const dobMonth = isoDOB.split('-')[1];
        const dobDay = isoDOB.split('-')[2];
        const formattedDOB = dobMonth + '/' + dobDay + '/' + dobYear;

        return {
            id: this.id,
            mrn: this.mrn,
            first_name: this.first_name,
            middle_name: this.middle_name,
            last_name: this.last_name,
            date_of_birth: formattedDOB,
            street: this.street,
            house_number: this.house_number,
            city: this.city,
            state: this.state,
            zip: this.zip,
            country: this.country,
            phone: this.phone,
            email: this.email,
        };
    }

    /**
     * Creates a new patient object'
     * @param {number} id
     * @param {string} mrn
     * @param {string} first_name 
     * @param {string} middle_name
     * @param {string} last_name
     * @param {date} date_of_birth
     * @param {string} street
     * @param {number} house_number
     * @param {string} city
     * @param {string} state
     * @param {number} zip
     * @param {string} country
     * @param {number} phone
     * @param {string} email
     * @returns {Promise<object>} Patient object 
     * @throws Throws error if query fails
     */
    static async create({id, mrn, first_name, middle_name, last_name, date_of_birth, street, house_number, city, state, zip, country, phone, email}) {
        if (!first_name || !last_name || !date_of_birth) {
          throw Error("First name, last name, and date of birth are required");
        }

        // Create unique MRN
        const hash = crypto.randomBytes(3).toString('hex').toUpperCase();
        const newMrn = 'T36-' + hash;

        // Convert date format
        const dateOfBirth = new Date(date_of_birth);
    
        return new this({id, mrn: newMrn, first_name, middle_name, last_name, date_of_birth: dateOfBirth, street, house_number, city, state, zip, country, phone, email });
    }

    /**
     * Gets patient by id
     * @param {number} patientId 
     * @returns {Promise<object>} User object or undefined
     * @throws Throws error if query fails 
     */
    static async getById(patientId) {
        try {
            const patientData = await db.patients.findUnique({
                where: { id: patientId }
            });
            return patientData ? new Patient(patientData) : undefined;
        }
        catch (error) {
            throw error;
        }
    }

    /**
     * Gets patient by mrn
     * @param {number} mrn 
     * @returns {Promise<object>} User object or undefined
     * @throws Throws error if query fails 
     */
    static async getByMRN(mrn) {
        try {
            const patientData = await db.patients.findUnique({
                where: { mrn: mrn }
            });
            return patientData ? new Patient(patientData) : undefined;
        }
        catch (error) {
            throw error;
        }
    }

    /**
     * Gets patient by user_id
     * @param {number} userId 
     * @returns {Promise<object>} User object or undefined
     * @throws Throws error if query fails 
     */
     static async getByUserId(userId) {
        try {
            const u_x_p = await db.users_x_patients.findFirst({
                where: { user_id: userId }
            });
            const patientId = u_x_p.patient_id;
            const patientData = await db.patients.findUnique({
                where: { id: patientId }
            });
            return patientData ? new Patient(patientData) : undefined;
        }
        catch (error) {
            throw error;
        }
    }

    async store() { 
        try {
            const patientData = await db.patients.upsert({
                where: { mrn: this.mrn },
                update: {
                    first_name: this.first_name,
                    middle_name: this.middle_name,
                    last_name: this.last_name,
                    date_of_birth: this.date_of_birth,
                    street: this.street,
                    house_number: this.house_number,
                    city: this.city,
                    state: this.state,
                    zip: this.zip,
                    country: this.country,
                    phone: this.phone,
                    email: this.email,
                },
                create: {
                    mrn: this.mrn,
                    first_name: this.first_name,
                    middle_name: this.middle_name,
                    last_name: this.last_name,
                    date_of_birth: this.date_of_birth,
                    street: this.street,
                    house_number: this.house_number,
                    city: this.city,
                    state: this.state,
                    zip: this.zip,
                    country: this.country,
                    phone: this.phone,
                    email: this.email,
                }
            });
            Object.assign(this, patientData);
            return this;
        }
        catch (error) {
            throw error;
        }
    }

    /**
     * Maps to user_id
     * @param {number} userId 
     * @returns {Promise<object>} User object or undefined
     * @throws Throws error if query fails 
     */
     async mapToUser(userId) {
        try {
            const u_x_p = await db.users_x_patients.upsert({
                where: { id: 999999999 },
                update: {
                    user_id: userId,
                    patient_id: this.id,
                    access: 'full',
                },
                create: {
                    user_id: userId,
                    patient_id: this.id,
                    access: 'full',
                }
            });
            return this;
        }
        catch (error) {
            throw error;
        }
    }

}

module.exports = Patient;
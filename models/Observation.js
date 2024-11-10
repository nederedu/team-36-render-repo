const db = require('../lib/db');

class Observation {
  constructor({ id, patient_id, type, value, unit, observation_instant }) {
    this.id = id;
    this.patient_id = patient_id;
    this.type = type;
    this.value = value;
    this.unit = unit;
    this.observation_instant = new Date(observation_instant);
  }

  /**
   * Creates a new observation object
   * @param {string} type observation type
   * @returns {Promise<object>} Observation object
   * @throws Throws error if query fails
   */
  static async create({ id, patient_id, type, value, unit, observation_instant }) {
    if (!patient_id || !type || !value || !unit || !observation_instant) {
      throw Error("Patient, type, value, unit, and observation instant are required");
    }

    return new this({ id, patient_id, type, value, unit, observation_instant });
  }

  /**
   * Gets observation by id
   * @param {number} obsId observation id
   * @returns {Promise<object>} Observation object or undefined
   * @throws Throws error if query fails
   */
  static async getById(obsId) {
    try {
      const obsData = await db.observations.findUnique({
        where: { id: obsId },
      });
      return obsData ? new Observation(obsData) : undefined;
    } catch (error) {
      throw error;
    }
  }

  static async getObsForPat(patient_id) {
    try {
      const readings = await db.observations.findMany({
        where: { patient_id: patient_id },
      });
      return readings;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Stores an observation object in the database
   * @param {string} type type
   * @returns {Promise<object>} Observation object
   * @throws Throws error if query fails
   */
  async store() {
    try {
      const obsData = await db.observations.create({
        data: {
          patient_id: this.patient_id,
          type: this.type,
          value: this.value,
          unit: this.unit,
          observation_instant: this.observation_instant,
        }
      }); 
      Object.assign(this, obsData);
      return this;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Sets the id
   * @param {number} id id
   * @returns {Promise<object>} Observation object
   * @throws Throws error if query fails
   */
   async setId(id) {
    this.id = id;
    return this;
  }

  /**
   * Sets the type
   * @param {string} type type
   * @returns {Promise<object>} Observation object
   * @throws Throws error if query fails
   */
   async setType(type) {
    this.type = type;
    return this;
  }

  /**
   * Sets the value
   * @param {number} value value
   * @returns {Promise<object>} Observation object
   * @throws Throws error if query fails
   */
   async setValue(value) {
    this.value = value;
    return this;
  }

  /**
   * Sets the unit
   * @param {string} unit unit
   * @returns {Promise<object>} Observation object
   * @throws Throws error if query fails
   */
   async setUnit(unit) {
    this.unit = unit;
    return this;
  }

  /**
   * Sets the observation instant
   * @param {Date} observation_instant observation instant
   * @returns {Promise<object>} Observation object
   * @throws Throws error if query fails
   */
   async setObservationInstant(observation_instant) {
    this.observation_instant = observation_instant;
    return this;
  }

  /**
   * Sets the patient id
   * @param {string} patient_id patient id
   * @returns {Promise<object>} Observation object
   * @throws Throws error if query fails
   */
   async setPatient(patient_id) {
    this.patient_id = patient_id;
    return this;
  }
  
  // Method to delete the observation permanently
  async delete() {
    await db.observations.delete({
      where: { id: this.id },
    });
    return true;
  }
}

module.exports = Observation;
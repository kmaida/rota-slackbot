const Rota = require('./Rota');

/*------------------
  DATABASE / STORE
------------------*/
const store = {
  /**
   * Get rotations
   * @return {object[]} array of existing rotation objects
   */
  async getRotations() {
    return Rota.find({}, (err, rotations) => {
      const arr = [];
      if (err) console.error(err.message);
      rotations.forEach(rotation => {
        arr.push(rotation);
      });
      return arr;
    });
  },
  /**
   * Create new rotation
   * @param {string} rotaname name of new rotation
   * @param {string} description description of new rotation
   * @return {object} newly saved rotation
   */
  async newRotation(rotaname, description) {
    return Rota.findOne({ name: rotaname }, (err) => {
      if (err) console.error(err.message);
      const rotation = new Rota({
        name: rotaname,
        description: description,
        assigned: null
      });
      rotation.save((err) => {
        if (err) console.error(err.message);
        return rotation;
      });
    });
  },
  /**
   * Update description for existing rotation
   * @param {string} rotaname updated name of rotation
   * @param {string} description updated description of rotation
   * @return {object} newly updated, saved rotation
   */
  async updateDescription(rotaname, description) {
    return Rota.findOne({ name: rotaname }, (err, rotation) => {
      if (err) console.error(err.message);
      rotation.description = description;
      rotation.save((err) => {
        if (err) console.error(err.message);
        return rotation;
      });
    });
  },
  /**
   * Save rotation staff to rotation store
   * @param {string} rotaname rotation name
   * @param {string[]} staffArr array of staff user IDs
   * 
   */
  async saveStaff(rotaname, staffArr) {
    return Rota.findOne({ name: rotaname }, (err, rotation) => {
      if (err) console.error(err.message);
      rotation.staff = staffArr;
      rotation.save((err) => {
        if (err) console.error(err.message);
        return rotation;
      });
    });
  },
  /**
   * Save user assignment to rotation store
   * @param {string} rotaname rotation name
   * @param {string} usermention user mention string <@UXXXXX>
   * @return {object} saved rotation with new assignment
   */
  async saveAssignment(rotaname, usermention) {
    return Rota.findOne({ name: rotaname }, (err, rotation) => {
      if (err) console.error(err.message);
      rotation.assigned = usermention;
      rotation.save((err) => {
        if (err) console.error(err.message);
        return rotation;
      });
    });
  },
  /**
   * Get rotation object for a specific rotation
   * @param {string} rotaname rotation name
   * @return {object} rotation object
   */
  async getRotation(rotaname) {
    return Rota.findOne({ name: rotaname }, (err, rotation) => {
      if (err) console.error(err.message);
      return rotation;
    });
  },
  /**
   * Deletes a rotation entirely
   * @param {string} rotaname rotation name
   */
  async deleteRotation(rotaname) {
    return Rota.findOne({ name: rotaname }, (err, rotation) => {
      if (err) console.error(err.message);
      rotation.remove(err => {
        if (err) console.error(err.message);
      });
    });
  }
};

module.exports = store;
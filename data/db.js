const Rota = require('./Rota');

/*------------------
  DATABASE / STORE
------------------*/

const store = {
  /*----
    Get rotations
  ----*/
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
  /*----
    Create new rotation
    @Params: rotation name, description
  ----*/
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
  /*----
    Save rotation staff to rotation store
    @Params: rotation name, staff array
  ----*/
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
  /*----
    Save user assignment to rotation store
    @Params: rotation name, usermention to assign
  ----*/
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
  /*----
    Get rotation object for a specific rotation
    @Params: rotation
    @Returns: rotation object
  ----*/
  async getRotation(rotaname) {
    return Rota.findOne({ name: rotaname }, (err, rotation) => {
      if (err) console.error(err.message);
      return rotation;
    });
  },
  /*----
    Deletes a rotation entirely
    @Params: rotation
  ----*/
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
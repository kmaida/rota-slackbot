const Rotation = require('./../schema/Rotation');

/*------------------
  DATABASE / STORE
------------------*/

const store = {
  /*----
    Get rotations
  ----*/
  getRotations() {
    return Rotation.find({}, (err, rotations) => {
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
  newRotation(rotaname, description) {
    return Rotation.findOne({ name: rotaname }, (err) => {
      if (err) console.error(err.message);
      const rotation = new Rotation({
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
  saveStaff(rotaname, staffArr) {
    return Rotation.findOne({ name: rotaname }, (err, rotation) => {
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
  saveAssignment(rotaname, usermention) {
    return Rotation.findOne({ name: rotaname }, (err, rotation) => {
      if (err) console.error(err.message);
      rotation.assigned = usermention;
      rotation.save((err) => {
        if (err) console.error(err.message);
        return rotation;
      });
    });
  },
  /*----
    Get assigned user for a specific rotation
    @Params: rotation
    @Returns: assigned usermention
  ----*/
  getAssignment(rotaname) {
    return Rotation.findOne({ name: rotaname }, (err, rotation) => {
      if (err) console.error(err.message);
      return rotation.assigned;
    });
  },
  /*----
    Get staff list for a rotation
    @Params: rotation
    @Returns: staff list array (or undefined)
  ----*/
  getStaffList(rotaname) {
    return Rotation.findOne({ name: rotaname }, (err, rotation) => {
      if (err) console.error(err.message);
      return rotation.staff;
    });
  },
  /*----
    Clears assigned user for a rotation (rotation value)
    @Params: rotation
  ----*/
  clearAssignment(rotaname) {
    return Rotation.findOne({ name: rotaname }, (err, rotation) => {
      if (err) console.error(err.message);
      rotation.assigned = null;
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
  getRotation(rotaname) {
    return Rotation.findOne({ name: rotaname }, (err, rotation) => {
      if (err) console.error(err.message);
      return rotation;
    });
  },
  /*----
    Deletes a rotation entirely
    @Params: rotation
  ----*/
  deleteRotation(rotaname) {
    return Rotation.findOne({ name: rotaname }, (err, rotation) => {
      if (err) console.error(err.message);
      rotation.remove(err => {
        if (err) console.error(err.message);
      });
    });
  }
};

module.exports = store;
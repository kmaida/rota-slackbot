const Rotation = require('./../schema/Rotation');

/*------------------
  DATABASE / STORE
------------------*/

const store = () => {
  /*----
    Get rotations
  ----*/
  const getRotations = () => {
    Rotation.find({}, (err, rotations) => {
      const rotationsArr = [];
      if (err) console.error(err.message);
      if (rotations) {
        rotations.forEach(rotation => {
          rotationsArr.push(rotation);
        });
      }
      return rotationsArr;
    });
  };
  /*----
    Create new rotation
    @Params: rotation name, description
  ----*/
  const newRotation = (rotaname, description) => {
    Rotation.findOne({ name: rotaname }, (err) => {
      if (err) console.error(err.message);
      const rotation = new Rotation({
        name: rotaname,
        description: description,
        assigned: null
      });
      rotation.save((err) => {
        if (err) console.error(err.message);
        return forum;
      });
    });
  };
  /*----
    Save rotation staff to rotation store
    @Params: rotation name, staff array
  ----*/
  const saveStaff = (rotaname, staffArr) => {
    Rotation.findOne({ name: rotaname }, (err, rotation) => {
      if (err) console.error(err.message);
      rotation.staff = staffArr;
      rotation.save((err) => {
        if (err) console.error(err.message);
        return forum;
      });
    });
  };
  /*----
    Save user assignment to rotation store
    @Params: rotation name, usermention to assign
  ----*/
  const saveAssignment = (rotaname, usermention) => {
    Rotation.findOne({ name: rotaname }, (err, rotation) => {
      if (err) console.error(err.message);
      rotation.assigned = usermention;
      rotation.save((err) => {
        if (err) console.error(err.message);
        return rotation;
      });
    });
  };
  /*----
    Get assigned user for a specific rotation
    @Params: rotation
    @Returns: assigned usermention
  ----*/
  const getAssignment = (rotaname) => {
    Rotation.findOne({ name: rotaname }, (err, rotation) => {
      if (err) console.error(err.message);
      return rotation.assigned;
    });
  };
  /*----
    Get staff list for a rotation
    @Params: rotation
    @Returns: staff list array (or undefined)
  ----*/
  const getStaffList = (rotaname) => {
    Rotation.findOne({ name: rotaname }, (err, rotation) => {
      if (err) console.error(err.message);
      return rotation.staff;
    });
  };
  /*----
    Clears assigned user for a rotation (rotation value)
    @Params: rotation
  ----*/
  const clearAssignment = (rotaname) => {
    Rotation.findOne({ name: rotaname }, (err, rotation) => {
      if (err) console.error(err.message);
      rotation.assigned = null;
      rotation.save((err) => {
        if (err) console.error(err.message);
        return rotation;
      });
    });
  };
  /*----
    Get rotation object for a specific rotation
    @Params: rotation
    @Returns: rotation object
  ----*/
  const getRotation = (rotaname) => {
    Rotation.findOne({ name: rotaname }, (err, rotation) => {
      if (err) console.error(err.message);
      return rotation;
    });
  };
  /*----
    Deletes a rotation entirely
    @Params: rotation
  ----*/
  const deleteRotation = (rotaname) => {
    Rotation.findOne({ name: rotaname }, (err, rotation) => {
      if (err) console.error(err.message);
      rotation.remove(err => {
        if (err) console.error(err.message);
      });
    });
  };
};

module.exports = store;
const Rotation = require('./../schema/Rotation');
const Staff = require('./../schema/Staff'); // This might not be needed!

/*------------------
  DATABASE / STORE
------------------*/

const store = (mongoose) => {
  /*----
    Get rotations
  ----*/
  const getRotations = () => {
    
  };
  /*----
    Create new rotation
    @Params: rotation name, description
  ----*/
  const newRotation = (rotation, description) => {
    const list = this.getStoreList();
    list[rotation] = {
      description,
      assigned: null
    };
    fs.writeFileSync(storeFilepath, JSON.stringify(list, null, 2));
  };
  /*----
    Save rotation staff to rotation store
    @Params: rotation name, staff array
  ----*/
  const saveStaff = (rotation, staffArr) => {
    const list = this.getStoreList();
    list[rotation].staff = staffArr;
    fs.writeFileSync(storeFilepath, JSON.stringify(list, null, 2));
  };
  /*----
    Save user assignment to rotation store
    @Params: rotation name, usermention to assign
  ----*/
  const saveAssignment = (rotation, usermention) => {
    const list = this.getStoreList();
    list[rotation].assigned = usermention;
    fs.writeFileSync(storeFilepath, JSON.stringify(list, null, 2));
  };
  /*----
    Get assigned user for a specific rotation
    @Params: rotation
    @Returns: assigned usermention
  ----*/
  const getAssignment = (rotation) => {
    const list = this.getStoreList();
    return list[rotation].assigned;
  };
  /*----
    Get staff list for a rotation
    @Params: rotation
    @Returns: staff list array (or undefined)
  ----*/
  const getStaffList = (rotation) => {
    const list = this.getStoreList();
    return list[rotation].staff;
  };
  /*----
    Clears assigned user for a rotation (rotation value)
    @Params: rotation
  ----*/
  const clearAssignment = (rotation) => {
    const list = this.getStoreList();
    list[rotation].assigned = null;
    fs.writeFileSync(storeFilepath, JSON.stringify(list, null, 2));
  };
  /*----
    Get rotation object for a specific rotation
    @Params: rotation
    @Returns: rotation object
  ----*/
  const getRotation = (rotation) => {
    const list = this.getStoreList();
    return list[rotation];
  };
  /*----
    Deletes a rotation entirely
    @Params: rotation
  ----*/
  const deleteRotation = (rotation) => {
    const list = this.getStoreList();
    delete list[rotation];
    fs.writeFileSync(storeFilepath, JSON.stringify(list, null, 2));
  };
};

module.exports = store;
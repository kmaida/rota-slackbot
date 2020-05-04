const fs = require('fs');
const storeFilepath = './rota.json';

const store = {
  /*----
    If store JSON file doesn't exist, create it
  ----*/
  initStore() {
    if (fs.existsSync(storeFilepath)) {
      console.log('Local store exists');
    } else {
      fs.writeFile(storeFilepath, '{}', (error) => {
        if (error) {
          console.error('ERROR: Failed to create local store file:', error);
        } else {
          console.log('Local store created successfully');
        }
      });
    }
  },
  /*----
    Get contents of store JSON file
  ----*/
  getStoreList() {
    return JSON.parse(fs.readFileSync(storeFilepath));
  },
  /*----
    Create new rotation
    @Params: rotation name, description
  ----*/
  newRotation(rotation, description) {
    const list = this.getStoreList();
    list[rotation] = {
      description,
      assigned: null
    };
    fs.writeFileSync(storeFilepath, JSON.stringify(list, null, 2));
  },
  /*----
    Save rotation staff to rotation store
    @Params: rotation name, staff array
  ----*/
  saveStaff(rotation, staffArr) {
    const list = this.getStoreList();
    list[rotation].staff = staffArr;
    fs.writeFileSync(storeFilepath, JSON.stringify(list, null, 2));
  },
  /*----
    Save user assignment to rotation store
    @Params: rotation name, usermention to assign
  ----*/
  saveAssignment(rotation, usermention) {
    const list = this.getStoreList();
    list[rotation].assigned = usermention;
    fs.writeFileSync(storeFilepath, JSON.stringify(list, null, 2));
  },
  /*----
    Get assigned user for a specific rotation
    @Params: rotation
    @Returns: assigned usermention
  ----*/
  getAssignment(rotation) {
    const list = this.getStoreList();
    return list[rotation].assigned;
  },
  /*----
    Get staff list for a rotation
    @Params: rotation
    @Returns: staff list array (or undefined)
  ----*/
  getStaffList(rotation) {
    const list = this.getStoreList();
    return list[rotation].staff;
  },
  /*----
    Clears assigned user for a rotation (rotation value)
    @Params: rotation
  ----*/
  clearAssignment(rotation) {
    const list = this.getStoreList();
    list[rotation].assigned = null;
    fs.writeFileSync(storeFilepath, JSON.stringify(list, null, 2));
  },
  /*----
    Get rotation object for a specific rotation
    @Params: rotation
    @Returns: rotation object
  ----*/
  getRotation(rotation) {
    const list = this.getStoreList();
    return list[rotation];
  },
  /*----
    Deletes a rotation entirely
    @Params: rotation
  ----*/
  deleteRotation(rotation) {
    const list = this.getStoreList();
    delete list[rotation];
    fs.writeFileSync(storeFilepath, JSON.stringify(list, null, 2));
  }
};

module.exports = store;
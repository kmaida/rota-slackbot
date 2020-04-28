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
    Save user assignment to rotation store
    @Params: rotation name, usermention to assign
  ----*/
  saveAssignment(rotation, usermention) {
    const list = this.getStoreList();
    list[rotation] = usermention;
    fs.writeFileSync(storeFilepath, JSON.stringify(list, null, 2));
  },
  /*----
    Get assigned user for a specific rotation
    @Params: rotation
    @Returns: assigned usermention
  ----*/
  getAssignment(rotation) {
    const list = this.getStoreList();
    return list[rotation];
  },
  /*----
    Clears assigned user for a rotation (rotation value)
    @Params: rotation
  ----*/
  clearAssignment(rotation) {
    const list = this.getStoreList();
    list[rotation] = null;
    fs.writeFileSync(storeFilepath, JSON.stringify(list, null, 2));
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
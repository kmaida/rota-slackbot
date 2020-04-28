const fs = require('fs');
const storeFilepath = './rota.json';

const store = {
  initStore: () => {
    // If store file doesn't exist, create it
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
  getStoreList: () => {
    return JSON.parse(fs.readFileSync(storeFilepath));
  },
  saveAssignment: (rotation, assigned) => {
    // Save assignment for rotation
    // If rotation doesn't already exists, it is created
    const list = JSON.parse(fs.readFileSync(storeFilepath));
    list[rotation] = assigned;
    fs.writeFileSync(storeFilepath, JSON.stringify(list, null, 2));
  },
  getAssignment: (rotation) => {
    // Get currently assigned person for rotation
    const list = JSON.parse(fs.readFileSync(storeFilepath));
    return list[rotation];
  },
  clearAssignment: (rotation) => {
    const list = JSON.parse(fs.readFileSync(storeFilepath));
    list[rotation] = null;
    fs.writeFileSync(storeFilepath, JSON.stringify(list, null, 2));
  },
  deleteRotation: (rotation) => {
    const list = JSON.parse(fs.readFileSync(storeFilepath));
    delete list[rotation];
    fs.writeFileSync(storeFilepath, JSON.stringify(list, null, 2));
  }
};

module.exports = store;
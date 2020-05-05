const mongoose = require('mongoose');
const Schema = mongoose.Schema;

/*------------------
    STAFF SCHEMA
------------------*/
mongoose.Promise = global.Promise;

const staffSchema = new Schema({
  usermention: { type: String }
});

module.exports = mongoose.model('Staff', staffSchema);
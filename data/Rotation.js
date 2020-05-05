const mongoose = require('mongoose');
const Schema = mongoose.Schema;

/*------------------
  ROTATION SCHEMA
------------------*/
mongoose.Promise = global.Promise;

const rotationSchema = new Schema({
  name: { type: String, required: true },
  description: String,
  assigned: String,
  staff: [String]
});

module.exports = mongoose.model('Rotation', rotationSchema);
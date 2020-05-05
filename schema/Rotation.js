const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const staffSchema = require('./Staff');

/*------------------
  ROTATION SCHEMA
------------------*/
mongoose.Promise = global.Promise;

const rotationSchema = new Schema({
  name: { type: String, required: true },
  description: { type: String },
  assigned: { type: String },
  staff: { type: [staffSchema] }
});

module.exports = mongoose.model('Rotation', rotationSchema);
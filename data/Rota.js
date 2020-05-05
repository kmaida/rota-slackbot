const mongoose = require('mongoose');
const Schema = mongoose.Schema;

/*------------------
    ROTA SCHEMA
------------------*/
const rotaSchema = new Schema({
  name: { type: String, required: true },
  description: String,
  assigned: String,
  staff: [String]
});

module.exports = mongoose.model('Rota', rotaSchema);
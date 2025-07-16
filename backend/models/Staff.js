const mongoose = require('mongoose');

const staffSchema = new mongoose.Schema({
  id: {type: String, required: true, unique: true},
  name: String,
  standard: String,
  workingRole: String,
  phone: String,
  altPhone: String,
  address: String,
  landmark: String,
  city: String,
  state: String,
  country: String, 
  date: String,
});

module.exports = mongoose.model('Staff', staffSchema);

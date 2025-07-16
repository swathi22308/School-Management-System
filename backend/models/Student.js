const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  id: {type: String, required: true, unique: true},
  name: String,
  standard: String,
  gender:String,
  parent: String,
  phone: String,
  altPhone: String,
  address: String,
  landmark: String,
  city: String,
  state: String,
  country: String,
  profile: String, 
  date: String,
});

module.exports = mongoose.model('Student', studentSchema);

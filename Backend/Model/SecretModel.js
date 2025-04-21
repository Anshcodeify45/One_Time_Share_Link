const mongoose = require('mongoose');

const secretSchema = new mongoose.Schema({
  uuid: { type: String, required: true, unique: true },
  secretText: { type: String, required: true },
});

module.exports = mongoose.model('Secret', secretSchema);

const mongoose = require('mongoose');

const secretSchema = new mongoose.Schema({
  uuid: { type: String, required: true, unique: true },
  secretText: { type: String, required: true },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 3600  // Secret will expire in 3600 seconds = 1 hour
  }
});

module.exports = mongoose.model('Secret', secretSchema);

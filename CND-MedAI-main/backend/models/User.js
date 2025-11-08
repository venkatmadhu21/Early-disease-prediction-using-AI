const mongoose = require('mongoose');
const COLLECTION_NAME = process.env.COLLECTION_NAME || 'users';

const UserSchema = new mongoose.Schema({
  fullName: { type: String },
  doctorId: { type: String },
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  hospitalName: { type: String },
  area: { type: String },
  profilePicture: { type: String }, // base64 encoded image
}, { timestamps: true, collection: COLLECTION_NAME });

// Export the Mongoose model for use in the app
// The server code performs hashing/verification with bcryptjs, so we only
// need to export the model here.
module.exports = mongoose.model('User', UserSchema);
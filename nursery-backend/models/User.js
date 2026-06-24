const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
  name:     { type: String, required: true },
  email:    { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role:     { type: String, enum: ['user','admin'], default: 'user' },
  wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
  gardeningExperience: { type: String, enum: ['Beginner', 'Intermediate', 'Expert'], default: 'Beginner' },
  homeType:            { type: String, enum: ['Apartment', 'House', 'Office', 'Balcony'], default: 'Apartment' },
  sunlightAvailability:{ type: String, enum: ['Low', 'Medium', 'High'], default: 'Medium' },
  petOwnership:        { type: String, enum: ['No Pets', 'Has Pets'], default: 'No Pets' },
}, { timestamps: true });
module.exports = mongoose.model('User', userSchema);

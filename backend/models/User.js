// User.js - Updated Schema
const mongoose = require('mongoose');
const { Schema } = mongoose; // Destructure Schema from mongoose

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  bio: { type: String, default: "Hi, I'm a music enthusiast!" },
  profilePicture: { 
    type: String, 
    default: "https://media.istockphoto.com/id/1353379172/photo/cute-little-african-american-girl-looking-at-camera.jpg?s=1024x1024&w=is&k=20&c=umFtOYrvwG4HIDCAskJ5U-2ncPlSoNXETjog2YbpC10=" 
  },
  name: { type: String, default: '' },
  followers: [{ type: String }], // Array of usernames of users following this user
  following: [{ type: String }], 

}, {
  timestamps: true
});

module.exports = mongoose.model('User', UserSchema);
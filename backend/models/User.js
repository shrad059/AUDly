const mongoose = require('mongoose');
const { Schema } = mongoose; 

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  bio: { type: String, default: "Hi, I'm a musicss enthusiast!" },
  profilePicture: { 
    type: String, 
    default:"https://bellfund.ca/wp-content/uploads/2018/03/demo-user.jpg"
  },
  name: { type: String, default: 'NAme' },
  followers: [{ type: String }], 
  following: [{ type: String }], 
  likedSongs: [{ type: mongoose.Schema.Types.ObjectId, ref: "Song" }], 

}, {
  timestamps: true
});

module.exports = mongoose.model('User', UserSchema);
const User = require('./User');

const mongoose = require('mongoose');


const songSchema = new mongoose.Schema({
  username: { type: String, required: true },
  songName: { type: String, required: true },
  artist: { type: String, required: true },
  albumArt: { type: String },
  spotifyLink: { type: String },
  profilePicture: { type: String }, 
  comment: { type: String },
  likedUsers: [{ type: String }], 
}, {
  timestamps: true
});

module.exports = mongoose.model('Song', songSchema);


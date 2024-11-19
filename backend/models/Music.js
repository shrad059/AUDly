const User = require('./User');

const mongoose = require('mongoose');

// const songSchema = new mongoose.Schema({
//   username: String,
//   songName: String,
//   artist: String,
//   albumArt: String,
//   spotifyLink: String,
//   userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Reference to the User model
// });

const songSchema = new mongoose.Schema({
  username: { type: String, required: true },
  songName: { type: String, required: true },
  artist: { type: String, required: true },
  albumArt: { type: String },
  spotifyLink: { type: String },
  profilePicture: { type: String }, // Add this
  comment: { type: String }        // Add this
});

module.exports = mongoose.model('Song', songSchema);


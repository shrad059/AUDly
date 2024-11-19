const express = require('express');
const fetch = require('node-fetch');
require('dotenv').config();
const Song = require('../models/Music');
const User = require('../models/User');

const router = express.Router();

// Your Spotify credentials
const CLIENT_ID = '483b7d8a51194faabfb6aed8f4565b4e';
const CLIENT_SECRET = '69319174700446e6a44b6978528b8332';

let accessToken = null;
let tokenExpiration = null;

// Get Spotify access token
async function getSpotifyToken() {
    // Check if we have a valid token
    if (accessToken && tokenExpiration && Date.now() < tokenExpiration) {
        return accessToken;
    }

    // Get new token
    const response = await fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': 'Basic ' + Buffer.from(CLIENT_ID + ':' + CLIENT_SECRET).toString('base64')
        },
        body: 'grant_type=client_credentials'
    });

    const data = await response.json();
    accessToken = data.access_token;
    console.log(accessToken);
    // Token expires in 3600 seconds, we'll set expiration a bit earlier to be safe
    tokenExpiration = Date.now() + (data.expires_in - 60) * 1000;
    return accessToken;
}

router.get('/getSpotifyToken', async (req, res) => {
  try {
      const token = await getSpotifyToken(); // Your function to get the token
      res.json({ access_token: token });
  } catch (error) {
      res.status(500).json({ message: 'Failed to fetch token' });
  }
});
router.get('/search', async (req, res) => {
  try {
    const { query } = req.query;
    if (!query) {
      return res.status(400).json({ error: 'Search query is required' });
    }

    const token = await getSpotifyToken();
    const response = await fetch(
      `https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=track&limit=10`,
      {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }
    );
    
    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: error.message });
  }
});
// Endpoint to get playlist
router.get('/playlist/:id', async (req, res) => {
    try {
        const token = await getSpotifyToken();
        const response = await fetch(
            `https://api.spotify.com/v1/playlists/${req.params.id}`,
            {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            }
        );
        
        const data = await response.json();
        res.json(data);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: error.message });
    }
});
// router.post('/addSong', async (req, res) => {
//   const { username, songName, artist, albumArt, spotifyLink } = req.body;

//   try {
//     // Create a new song document for the user
//     const newSong = new Song({
//       username,
//       songName,
//       artist,
//       albumArt,
//       spotifyLink,
//     });

//     // Save the song to the database
//     await newSong.save();
//     res.status(200).json({ message: 'Song added successfully' });
//   } catch (error) {
//     console.error('Error adding song:', error);
//     res.status(500).json({ message: 'Error adding song', error: error.message });
//   }
// });

router.post('/addSong', async (req, res) => {
  const { username, songName, artist, albumArt, spotifyLink, comment } = req.body;

  try {
    // Fetch the user's profile picture from the User collection based on the username
    const user = await User.findOne({ username }); // Assuming you have a User model

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Create a new song document with user details
    const newSong = new Song({
      username,
      profilePicture: user.profilePicture, // Retrieve the profile picture from the user document
      songName,
      artist,
      albumArt,
      spotifyLink,
      comment, // Include the comment in the song document
    });
    console.log("newsong ", newSong);
    // Save the song to the database
    await newSong.save();
    res.status(200).json({ message: 'Song added successfully' });
  } catch (error) {
    console.error('Error adding song:', error);
    res.status(500).json({ message: 'Error adding song', error: error.message });
  }
});


// Endpoint to fetch songs posted by a user
router.get('/getSongs', async (req, res) => {
  const { username } = req.query;  // Assuming you're passing the username as a query parameter

  try {
    // Fetch all songs posted by the user from the database
    const songs = await Song.find({ username });

    if (songs.length === 0) {
      return res.status(404).json({ message: 'No songs found for this user' });
    }

    res.status(200).json(songs); // Send the list of songs back to the client
  } catch (error) {
    console.error('Error fetching songs:', error);
    res.status(500).json({ message: 'Error fetching songs', error: error.message });
  }
});
// Get all songs posted by any user
router.get('/getAllSongs', async (req, res) => {
  try {
    const songs = await Song.find(); // Fetch all songs from the database
    res.status(200).json(songs); // Return songs as JSON
  } catch (err) {
    console.error('Error fetching songs:', err);
    res.status(500).json({ message: 'Error fetching songs' });
  }
});

module.exports = router;
// Simple test endpoint
router.get('/test', (req, res) => {
    res.json({ message: 'Server is working!' });
});

module.exports = router;

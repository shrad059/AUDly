const express = require('express');
const fetch = require('node-fetch');
require('dotenv').config();
const Song = require('../models/Music');
const User = require('../models/User');

const router = express.Router();

const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
console.log(CLIENT_ID)
let accessToken = null;
let tokenExpiration = null;

const DEEZER_API_URL = 'https://api.deezer.com';

async function getSpotifyToken() {
  if (accessToken && tokenExpiration && Date.now() < tokenExpiration) {
        return accessToken;
    }

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
    tokenExpiration = Date.now() + (data.expires_in - 60) * 1000;
    return accessToken;
}

router.get('/deezer/search', async (req, res) => {
  try {
    const { query } = req.query;
    if (!query) {
      return res.status(400).json({ error: 'Search query is required' });
    }

    // Search for tracks using Deezer API
    const response = await fetch(`${DEEZER_API_URL}/search?q=${encodeURIComponent(query)}&limit=10`);
    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Deezer playlist route (similar to Spotify's playlist fetch)
router.get('/deezer/playlist/:id', async (req, res) => {
  try {
    const response = await fetch(`${DEEZER_API_URL}/playlist/${req.params.id}`);
    const data = await response.json();

    if (data && data.tracks && data.tracks.data) {
      const topSongs = data.tracks.data.slice(0, 10);  // Get top 10 songs
      res.json({ tracks: { items: topSongs } });
    } else {
      res.status(500).json({ error: 'Invalid data structure from Deezer API' });
    }
  } catch (error) {
    console.error('Error fetching Deezer playlist:', error);
    res.status(500).json({ error: error.message });
  }
});


router.get('/getSpotifyToken', async (req, res) => {
  try {
      const token = await getSpotifyToken(); 
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
router.get('/playlist/:id', async (req, res) => {
  try {
    const token = await getSpotifyToken();
    console.log("token "+token);
    const response = await fetch(
      `https://api.spotify.com/v1/playlists/${req.params.id}`,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      }
    );
    const data = await response.json();

    if (data && data.tracks && data.tracks.items) {
      // Ensure tracks.items exists and is not empty
      const topSongs = data.tracks.items.slice(0, 10);  // Get top 10 songs
      res.json({ tracks: { items: topSongs } });
    } else {
      res.status(500).json({ error: 'Invalid data structure from Spotify API' });
    }
  } catch (error) {
    console.error('Error fetching playlist:', error);
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
    console.error('Error fetching songs1:', error);
    res.status(500).json({ message: 'Error fetching songs2', error: error.message });
  }
});
// Get all songs posted by any user
router.get('/getAllSongs', async (req, res) => {
  try {
    const songs = await Song.find(); // Fetch all songs from the database
    res.status(200).json(songs); // Return songs as JSON
  } catch (err) {
    console.error('Error fetching songs3:', err);
    res.status(500).json({ message: 'Error fetching songs4' });
  }
});

module.exports = router;
// Simple test endpoint
router.get('/test', (req, res) => {
    res.json({ message: 'Server is working!' });
});

module.exports = router;

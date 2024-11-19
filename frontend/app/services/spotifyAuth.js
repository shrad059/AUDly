// // server/index.js
// const express = require('express');
// const cors = require('cors');
// const fetch = require('node-fetch');
// require('dotenv').config();

// const app = express();
// app.use(cors());

// // Your Spotify credentials
// const CLIENT_ID = '483b7d8a51194faabfb6aed8f4565b4e';
// const CLIENT_SECRET = '69319174700446e6a44b6978528b8332';

// let accessToken = null;
// let tokenExpiration = null;

// // Get Spotify access token
// async function getSpotifyToken() {
//     // Check if we have a valid token
//     if (accessToken && tokenExpiration && Date.now() < tokenExpiration) {
//         return accessToken;
//     }

//     // Get new token
//     const response = await fetch('https://accounts.spotify.com/api/token', {
//         method: 'POST',
//         headers: {
//             'Content-Type': 'application/x-www-form-urlencoded',
//             'Authorization': 'Basic ' + Buffer.from(CLIENT_ID + ':' + CLIENT_SECRET).toString('base64')
//         },
//         body: 'grant_type=client_credentials'
//     });

//     const data = await response.json();
//     accessToken = data.access_token;
//     // Token expires in 3600 seconds, we'll set expiration a bit earlier to be safe
//     tokenExpiration = Date.now() + (data.expires_in - 60) * 1000;
//     return accessToken;
// }

// // Endpoint to get playlist
// app.get('/playlist/:id', async (req, res) => {
//     try {
//         const token = await getSpotifyToken();
//         const response = await fetch(
//             `https://api.spotify.com/v1/playlists/${req.params.id}`,
//             {
//                 headers: {
//                     'Authorization': `Bearer ${token}`
//                 }
//             }
//         );
        
//         const data = await response.json();
//         res.json(data);
//     } catch (error) {
//         console.error('Error:', error);
//         res.status(500).json({ error: error.message });
//     }
// });

// // Simple test endpoint
// app.get('/test', (req, res) => {
//     res.json({ message: 'Server is working!' });
// });

// const PORT = 8005;
// app.listen(PORT, () => {
//     console.log(`Server running at http://localhost:${PORT}`);
// });
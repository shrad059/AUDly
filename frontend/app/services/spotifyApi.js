import axios from 'axios';

export async function getTopSongs(accessToken) {
  try {
    const response = await axios.get('https://api.spotify.com/v1/me/top/tracks?limit=10', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data.items;
  } catch (error) {
    console.error('Failed to fetch top songs:', error);
    return [];
  }
}

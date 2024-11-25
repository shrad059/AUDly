import React, { useState, useEffect } from 'react';
import { View, Text, Image, ActivityIndicator, StyleSheet, ScrollView, TouchableOpacity, TextInput, Animated } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router'; // Import router from expo-router
import AntDesign from '@expo/vector-icons/AntDesign';

const API_URL = 'https://audly.onrender.com/api/music'; // Update with your backend URL

const SpotifyTopSongs = () => {
  const [songs, setSongs] = useState([]);
  const [filteredSongs, setFilteredSongs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const router = useRouter(); // Initialize router

  const fetchSongs = async () => {
    try {
      const response = await fetch(`${API_URL}/playlist/37i9dQZF1DXcBWIGoYBM5M`);
      if (!response.ok) {
        throw new Error('Failed to fetch playlist');
      }
      const data = await response.json();
      const songsData = data.tracks.items.slice(0, 10);
      setSongs(songsData);
      setFilteredSongs(songsData);
    } catch (err) {
      console.error('Error fetching songs:', err);
    } finally {
      setLoading(false);
    }
  };

  const searchSpotify = async (query) => {
    if (!query.trim()) {
      setFilteredSongs(songs);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/search?query=${encodeURIComponent(query)}`);
      if (!response.ok) {
        throw new Error('Search failed');
      }
      const data = await response.json();
      const searchResults = data.tracks.items.map(track => ({
        track: {
          ...track,
          album: track.album,
          external_urls: track.external_urls,
          id: track.id,
          name: track.name,
          artists: track.artists,
        }
      }));

      setFilteredSongs(searchResults);
    } catch (err) {
      console.error('Error searching songs:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      searchSpotify(searchQuery);
    }, 500); // Add delay to avoid frequent requests

    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  useEffect(() => {
    fetchSongs();
  }, []);

  const handleAddButtonClick = (song) => {
    const songData = {
      name: song.track.name,
      artist: song.track.artists.map(artist => artist.name).join(', '),
      albumArt: song.track.album.images[0]?.url, // Ensure there's an image URL
      spotifyLink: song.track.external_urls.spotify
    };
    console.log("Passing song to PostMusic:", JSON.stringify(songData));

    // Navigate to PostMusic page and pass the song data
    router.push({
      pathname: "/postMusic",
      params: {
        songName: songData.name,
        artist: songData.artist,
        albumArt: songData.albumArt,
        spotifyLink: songData.spotifyLink,
      }
    });
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchInput}
        placeholder="Search Spotify songs..."
        value={searchQuery}
        onChangeText={setSearchQuery}
      />

      {loading ? (
        <ActivityIndicator size="large" color="#1DB954" />
      ) : (
<ScrollView contentContainerStyle={styles.scrollView}>
  {filteredSongs.map((item, index) => (
    <View key={item.track.id} style={styles.card}>
      <TouchableOpacity
        style={styles.songContainer}
        onPress={() => handleAddButtonClick(item)}
      >
        <View style={styles.albumArtContainer}>
          <Image
            source={{ uri: item.track.album.images[0].url }}
            style={styles.albumArt}
          />
          <View style={styles.songInfo}>
            <Text style={styles.songTitle} numberOfLines={1}>
              {index + 1}. {item.track.name}
            </Text>
            <Text style={styles.artistName} numberOfLines={1}>
              {item.track.artists.map(artist => artist.name).join(', ')}
            </Text>
          </View>
        </View>
      </TouchableOpacity>

      <TouchableOpacity
  style={styles.addButton}
  onPress={() => handleAddButtonClick(item)}
>
  <Text>
    <AntDesign name="right" size={24} color="black" />
  </Text>
</TouchableOpacity>

    </View>
  ))}
</ScrollView>

      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  searchInput: {
    height: 45,
    borderColor: '#1DB954',
    borderWidth: 1,
    borderRadius: 30,
    padding: 5,
    marginBottom: 20,
    backgroundColor: '#333',
    color: '#fff',
    fontSize: 16,
  },
  scrollView: {
    paddingBottom: 20,
  },
  card: {
    backgroundColor: '#1E1E1E',
    borderRadius: 15,
    marginBottom: 16,
    padding: 15,
    elevation: 5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  albumArt: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 15,
  },
  songInfo: {
    flexDirection: 'column',  // Align song name and artist vertically
    justifyContent: 'center',
  },
  songInfo: {
    flexDirection: 'column',  // Align song name and artist vertically
    justifyContent: 'center',
  },
  songTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  artistName: {
    fontSize: 14,
    color: '#ccc',
  },
  albumArtContainer: {
    // backgroundColor:'red',
    flexDirection: 'row',    // Aligns the image and text side by side
    alignItems: 'center',    // Vertically aligns the text and image
    // justifyContent: 'space-around', // Centers the album art
  },
  addButton: {
    backgroundColor: '#1DB954',
    padding: 12,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default SpotifyTopSongs;

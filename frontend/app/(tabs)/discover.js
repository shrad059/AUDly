import React, { useState, useEffect } from 'react';
import { View, Text, Image, ActivityIndicator, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { useRouter } from 'expo-router'; // Import router from expo-router
import AntDesign from '@expo/vector-icons/AntDesign';

const API_URL = 'https://audly.onrender.com/api/music'; 

const SpotifyTopSongs = () => {
  const [songs, setSongs] = useState([]);
  const [filteredSongs, setFilteredSongs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [error, setError] = useState(null); // Error state for handling fetch issues
  const router = useRouter(); // Initialize router

  // Fetch top songs
  const fetchSongs = async () => {
    setLoading(true);
    setError(null); // Reset error state on each fetch attempt
  
    try {
      const response = await fetch(`${API_URL}/playlist/6Hdnc4U8mZhZ3Vvq65rWsB`);
      if (!response.ok) {
        throw new Error('Failed to fetch playlist');
      }
  
      const data = await response.json();
      const songsData = data.tracks.items.slice(0, 10); // Get top 10 songs
      setSongs(songsData); // Save all fetched songs to `songs` state
      setFilteredSongs(songsData); // Set the filtered songs initially to all songs
    } catch (err) {
      console.error('Error fetching songs:', err);
      setError('Failed to fetch songs, please try again.'); // Set error state in case of fetch failure
    } finally {
      setLoading(false); // Stop loading state once the fetch is done
    }
  };

  // Search songs
  const searchSpotify = async (query) => {
    if (!query.trim()) {
      setFilteredSongs(songs); // Restore full list if the query is empty
      return;
    }

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
  
      setFilteredSongs(searchResults); // Update filtered list based on search results
    } catch (err) {
      console.error('Error searching songs:', err);
      setError('Search failed, please try again.'); // Set error state in case of failure
    } finally {
      setLoading(false); // Stop loading state once search is done
    }
  };

  // Debounced search input
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      searchSpotify(searchQuery);
    }, 500); // Add delay to avoid frequent requests

    return () => clearTimeout(timeoutId); // Cleanup timeout on query change
  }, [searchQuery]);

  // Fetch songs on component mount
  useEffect(() => {
    fetchSongs();
  }, []); // Empty dependency ensures it runs only once on mount

  // Handle song add button click
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
      ) : error ? (
        <Text style={styles.errorText}>{error}</Text>
      ) : filteredSongs.length === 0 ? (
        <Text style={styles.noResultsText}>No results found</Text>
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
          {index + 1}. {item.track.name.length > 20 ? `${item.track.name.substring(0, 20)}...` : item.track.name}
        </Text>
        <Text style={styles.artistName} numberOfLines={1}>
          {item.track.artists.map(artist => artist.name).join(', ').length > 20 
            ? `${item.track.artists.map(artist => artist.name).join(', ').substring(0, 20)}...` 
            : item.track.artists.map(artist => artist.name).join(', ')
          }
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
  songTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  artistName: {
    fontSize: 14,
    color: '#ccc',
  },
  albumArtContainer: {
    flexDirection: 'row',    // Aligns the image and text side by side
    alignItems: 'center',    // Vertically aligns the text and image
  },
  addButton: {
    backgroundColor: '#1DB954',
    padding: 12,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginTop: 20,
  },
  noResultsText: {
    color: '#fff',
    textAlign: 'center',
    marginTop: 20,
  },
});

export default SpotifyTopSongs;

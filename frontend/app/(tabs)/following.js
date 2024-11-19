import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, Linking } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';

const Following = () => {
  const [songs, setSongs] = useState([]);
  const [userUsername, setUserUsername] = useState('');
  const router = useRouter();  // Get router from expo-router

  useEffect(() => {
    const fetchUsername = async () => {
      try {
        const username = await AsyncStorage.getItem('username');
        if (username) {
          setUserUsername(username);
        }
      } catch (error) {
        console.error('Error getting username from AsyncStorage:', error);
      }
    };

    const fetchSongs = async () => {
      try {
        const response = await axios.get('http://192.168.2.26:8005/api/music/getAllSongs');
        const filteredSongs = response.data.filter(song => song.username !== userUsername);
        setSongs(filteredSongs);
      } catch (error) {
        console.error('Error fetching songs:', error);
      }
    };

    fetchUsername();
    fetchSongs();
  }, [userUsername]);

  const handleUsernamePress = (username) => {
    router.push(`/userProfile/${username}`);  // Navigate to the profile
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>For You</Text>
      {songs.length === 0 ? (
        <Text style={styles.noSongs}>No songs available</Text>
      ) : (
        songs.map((song, index) => (
          <View key={index} style={styles.songCard}>
            <View style={styles.userInfo}>
              {song.profilePicture && (
                <Image source={{ uri: song.profilePicture }} style={styles.profilePicture} />
              )}
              <TouchableOpacity onPress={() => handleUsernamePress(song.username)}>
                <Text style={styles.username}>{song.username}</Text>
              </TouchableOpacity>
            </View>

            {song.comment && <Text style={styles.comment}>{song.comment}</Text>}

            <View style={styles.albumArtContainer}>
              {song.albumArt && (
                <Image source={{ uri: song.albumArt }} style={styles.albumArt} />
              )}
              <View style={styles.songInfo}>
                <Text style={styles.songTitle}>{song.songName}</Text>
                <Text style={styles.artistName}>{song.artist}</Text>
              </View>
            </View>

            {song.spotifyLink && (
              <TouchableOpacity onPress={() => Linking.openURL(song.spotifyLink)}>
                <Text style={styles.spotifyLink}>Listen on Spotify</Text>
              </TouchableOpacity>
            )}
          </View>
        ))
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 16,
    backgroundColor: '#121212',  // Dark background color
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#fff',  // White text for dark theme
  },
  noSongs: {
    fontSize: 18,
    color: '#ccc',  // Light gray color for empty state text
    textAlign: 'center',
  },
  songCard: {
    backgroundColor: '#1E1E1E',  // Dark card background
    borderRadius: 15,
    padding: 15,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  profilePicture: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  username: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',  // White text for username
  },
  comment: {
    fontFamily: 'Chilanka',
    fontSize: 19,
    marginBottom: 10,
    color: '#ddd',  // Light gray color for comment text
  },
  albumArtContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  albumArt: {
    width: 120,
    height: 120,
    borderRadius: 8,
    backgroundColor: '#ddd',
    marginRight: 15,
  },
  songInfo: {
    flexDirection: 'column',
    justifyContent: 'center',
  },
  songTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',  // White text for song title
  },
  artistName: {
    fontSize: 16,
    color: '#bbb',  // Light gray color for artist name
  },
  spotifyLink: {
    color: '#1DB954',  // Green color for Spotify link
    textDecorationLine: 'underline',
    marginTop: 10,
  },
});

export default Following;

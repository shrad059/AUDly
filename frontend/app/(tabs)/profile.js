import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Image, 
  SafeAreaView, 
  ScrollView, 
  Alert, 
  Linking 
} from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter, useLocalSearchParams } from 'expo-router';  
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import Entypo from '@expo/vector-icons/Entypo';
import { Row } from 'native-base';
import { useFonts } from 'expo-font';

export default function Profile() {
  const router = useRouter();
  const { id } = useLocalSearchParams(); 
  const [userProfile, setUserProfile] = useState({
    username: '',
    bio: '',
    profilePicture: '',
    name: '',
    email: '',
    followersCount: 0,
    followingCount: 0,
  });
  const [postedSongs, setPostedSongs] = useState([]);

  useEffect(() => {
    fetchUserProfile();
    fetchPostedSongs();
  }, [id]); 

  const fetchUserProfile = async () => {
    try {
      const username = id || await AsyncStorage.getItem('username');
      if (!username) {
        Alert.alert('Error', 'Please log in again');
        return;
      }
      // const response = await axios.get(`http://localhost:8006/api/users/profile/${username}`);
      const response = await axios.get(`https://audly.onrender.com/api/users/profile/${username}`);
      setUserProfile(response.data);
    } catch (error) {
      console.error('Error fetching profile:', error);
      Alert.alert('Error', 'Failed to load profile');
    }
  };

  const fetchPostedSongs = async () => {
    try {
      const username = id || await AsyncStorage.getItem('username');
      // const response = await axios.get(`http://localhost:8006/api/music/getSongs?username=${username}`);
      const response = await axios.get(`https://audly.onrender.com/api/music/getSongs?username=${username}`);
      setPostedSongs(response.data);
    } catch (error) {
      console.error('Error fetching songs:', error);
    }
  };

  return (
<SafeAreaView style={{ flex: 1, backgroundColor: '#121212' }}>
  <ScrollView contentContainerStyle={styles.container} style={{ backgroundColor: '#121212' }}>
        <View style={styles.header}>
          <Text style={styles.username}>@{userProfile.username}</Text>
          {id !== userProfile.username && (
            <TouchableOpacity
              style={styles.editButton}
              onPress={() => router.push('/editProfile')}
            >
              <MaterialIcons name="edit" size={24} color="#fff" />
            </TouchableOpacity>
          )}
          <TouchableOpacity
            style={styles.editButton}
            onPress={() => router.push('/settings')}
          >
            <Entypo style={styles.editButton} name="dots-three-horizontal" size={24} color="#fff" />
          </TouchableOpacity>
        </View>

        <View style={styles.profileInfo}>
          <View style={styles.textContainer}>
          <Text style={styles.name}>{userProfile.name || 'Name'}</Text>
          <Text style={styles.bio}>{userProfile.bio}</Text>
            <View style={styles.stats}>
              <Text style={styles.statsText}>{userProfile.followersCount} Followers</Text>
              <Text style={styles.statsText}>{userProfile.followingCount} Following</Text>
            </View>
          </View>
          <Image 
            source={{ uri: userProfile.profilePicture }} 
            style={styles.profilePicture}
          />
        </View>

        {/* Posted Songs Section */}
        <View style={styles.songsContainer}>
          <Text style={styles.sectionTitle}>Posted Songs</Text>
          {/* Looks so lonely here... */}
          {postedSongs.map((song, index) => (
            <View key={index} style={styles.songCard}>
              <View style={styles.userInfo}>
                <Image source={{ uri: userProfile.profilePicture }} style={styles.profilePictureSmall} />
                <Text style={styles.songUsername}>{userProfile.username}</Text>
              </View>
              {song.comment && <Text style={styles.comment}>{song.comment}</Text>}

              {song.albumArt && (
                <View style={styles.albumArtContainer}>
                  <Image source={{ uri: song.albumArt }} style={styles.albumArt} />
                  <View style={styles.songInfo}>
                    <Text style={styles.songTitle}>{song.songName}</Text>
                    <Text style={styles.artistName}>{song.artist}</Text>
                  </View>
                </View>
              )}
              {song.spotifyLink && (
                <TouchableOpacity onPress={() => Linking.openURL(song.spotifyLink)}>
                  <Text style={styles.spotifyLink}>Listen on Spotify</Text>
                </TouchableOpacity>
              )}
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 16,
    backgroundColor: '#121212', 
    color: '#ccc', 
  },
  header: {
    flexDirection: 'row',
    marginTop: 3,
    marginBottom: 20,
    alignItems: 'center',
  },
  username: {
    fontSize: 22,
    margin: 'auto',
    fontWeight: 'bold',
    color: '#fff', 
    flex: 1,
    textAlign: 'center',
  },
  editButton: {
    padding: 5,
  },
  profileInfo: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 30,
    paddingHorizontal: 16,
  },
  textContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingVertical: 14,
  },
  name: {
    fontSize: 30,
    fontWeight: 'bold',
    fontFamily: 'GeistMono_400Regular',
    color: '#fff', 
  },
  bio: {
    fontSize: 16,
    color: '#bbb',
    marginBottom: 10,
  },
  profilePicture: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 1,
    borderColor: '#fff',
  },
  songsContainer: {
    marginTop: 30,
  },
  stats: {
    flexDirection: 'row',
    width: '50%',
    justifyContent: 'space-between',
  },
  statsText: {
    paddingHorizontal: 1,
    fontSize: 13,
    color: '#bbb',
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#fff', // White text for section title
  },
  songCard: {
    backgroundColor: '#1E1E1E', // Dark background for each song card
    borderRadius: 15,
    padding: 15,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
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
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff', // White text for song title
  },
  artistName: {
    fontSize: 16,
    color: '#bbb', // Lighter color for artist name
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  profilePictureSmall: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  songUsername: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff', // White text for song username
  },
  comment: {
    fontSize: 14,
    color: '#bbb', // Lighter color for comments
    marginBottom: 10,
  },
  spotifyLink: {
    color: '#1DB954', // Spotify link color
    textDecorationLine: 'underline',
    marginTop: 10,
  },
});

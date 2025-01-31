import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  Alert,
  Linking,
  ActivityIndicator,
  FlatList,
} from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter, useLocalSearchParams } from 'expo-router';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import AntDesign from '@expo/vector-icons/AntDesign';

export default function UserProfile() {
  const router = useRouter();
  const { username } = useLocalSearchParams();
  const [userProfile, setUserProfile] = useState(null);
  const [userUsername, setUserUsername] = useState(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [postedSongs, setPostedSongs] = useState([]);

  useEffect(() => {
    const fetchUsername = async () => {
      try {
        const username = await AsyncStorage.getItem('username');
        setUserUsername(username || '');
      } catch (error) {
        console.error('Error fetching username:', error);
      }
    };
    fetchUsername();
  }, []);

  useEffect(() => {
    if (userUsername) {
      const fetchProfile = async () => {
        try {
          // const response = await axios.get(`http://localhost:8006/api/users/profile/${username}`);
          const response = await axios.get(`https://audly.onrender.com/api/users/profile/${username}`);
          setUserProfile(response.data);
          setIsFollowing(response.data.followers.includes(userUsername));

          // const songsResponse = await axios.get(`http://localhost:8006//api/music/getSongs?username=${username}`);

          const songsResponse = await axios.get(`https://audly.onrender.com/api/music/getSongs?username=${username}`);
          setPostedSongs(songsResponse.data);
        } catch (error) {
          Alert.alert('Error', 'Failed to load profile.');
        } finally {
          setIsLoading(false);
        }
      };
      fetchProfile();
    }
  }, [username, userUsername]);

  const handleFollowToggle = async () => {
    try {
      const endpoint = isFollowing
      
      // ? `http://localhost:8006/api/users/unfollow/${username}`
      // : `http://localhost:8006/api/users/follow/${username}`;
        ? `https://audly.onrender.com/api/users/unfollow/${username}`
        : `https://audly.onrender.com/api/users/follow/${username}`;
      const response = await axios.post(endpoint, { currentUsername: userUsername });
      if (response.status === 200) {
        setIsFollowing(!isFollowing);
        setUserProfile((prev) => ({
          ...prev,
          followersCount: isFollowing ? prev.followersCount - 1 : prev.followersCount + 1,
        }));
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to update follow status.');
    }
  };

  if (isLoading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Loading...</Text>
      </View>
    );
  }

  if (!userProfile) {
    return (
      <View style={styles.container}>
        <Text>No user data available.</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.push('/following')}>
          <AntDesign name="left" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.username}>@{userProfile.username}</Text>
      </View>

      <View style={styles.profileInfo}>
        <View style={styles.textContainer}>
          <Text style={styles.name}>{userProfile.name}</Text>
          <Text style={styles.bio}>{userProfile.bio}</Text>
          <View style={styles.stats}>
            <Text style={styles.statText}>
              {userProfile.followersCount} Follower
            </Text>
            <Text style={styles.statText}>
              {userProfile.followingCount} Following
            </Text>
          </View>
        </View>
        <Image source={{ uri: userProfile.profilePicture }} style={styles.profilePicture} />
      </View>

      <TouchableOpacity
        onPress={handleFollowToggle}
        style={[styles.followButton, isFollowing && styles.unfollowButton]}
      >
        <Text style={styles.followButtonText}>{isFollowing ? 'Unfollow' : 'Follow'}</Text>
      </TouchableOpacity>

      <View style={styles.songsContainer}>
          <Text style={styles.sectionTitle}>Posted Songs</Text>
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
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#121212',
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  username: {
    color: '#fff',
    fontSize: 20,
    marginLeft: 8,
  },
  profileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  textContainer: {
    flex: 1,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  bio: {
    fontSize: 16,
    color: '#ccc',
    marginVertical: 8,
  },
  stats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statText: {
    fontSize: 14,
    color: '#aaa',
  },
  profilePicture: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  followButton: {
    backgroundColor: '#1DB954',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    alignItems: 'center',
    marginBottom: 16,
  },
  unfollowButton: {
    backgroundColor: '#B00020',
  },
  followButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  songsContainer: {
    marginTop: 16,
  },
  sectionTitle: {
    fontSize: 20,
    color: '#fff',
    marginBottom: 8,
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

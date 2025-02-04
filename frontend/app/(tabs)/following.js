import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { GestureHandlerRootView, PanGestureHandler } from 'react-native-gesture-handler';
import PaginatedSongs from '../(main)/PaginatedSongs';

const Following = () => {
  const [allSongs, setAllSongs] = useState([]);
  const [filteredSongs, setFilteredSongs] = useState([]);
  const [userUsername, setUserUsername] = useState('');
  const [isFollowing, setIsFollowing] = useState(false);
  const [followedUsers, setFollowedUsers] = useState([]);
  const [likedSongs, setLikedSongs] = useState({});

  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchLikedSongs = async () => {
      if (!userUsername) return;

      try {
        const response = await axios.get(`http://localhost:8006/api/users/${userUsername}/likedSongs`);
        const likedSongIds = response.data;
        console.log("🔥 Liked Songs from API:", likedSongIds);
        setLikedSongs(new Set(likedSongIds));
      } catch (error) {
        console.error("❌ Error fetching liked songs:", error);
        setLikedSongs(new Set());
      }
    };

    fetchLikedSongs();
  }, [userUsername]);

  useEffect(() => {
    const fetchUsername = async () => {
      try {
        const username = await AsyncStorage.getItem('username');
        if (username) {
          setUserUsername(username);
        } else {
          setError('Please log in again');
        }
      } catch (error) {
        setError('Failed to load user data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsername();
  }, []);

  useEffect(() => {
    const fetchFollowedUsers = async () => {
      try {
        if (!userUsername) return;
        const response = await axios.get(`http://localhost:8006/api/users/following/${userUsername}`);
        console.log("Followed users from API:", response.data);
        setFollowedUsers(response.data);
      } catch (error) {
        console.error("Failed to load followed users:", error);
        setError('Failed to load followed users');
        setFollowedUsers([]);
      }
    };

    fetchFollowedUsers();
  }, [userUsername]);

  useEffect(() => {
    const fetchSongs = async () => {
      try {
        const response = await axios.get('http://localhost:8006/api/music/getAllSongs');
        console.log("All Songs:", response.data);
        setAllSongs(response.data);
  
        console.log("Followed Userrrs:", followedUsers);
  
        if (followedUsers.length > 0) {
          const followedUsernames = followedUsers.map(user => user.username);
          const filtered = response.data.filter(song =>
            followedUsers.includes(song.username)
          );

          console.log("Followed Usernames:", followedUsernames);

          console.log("Filtered Songs:", filtered);
          setFilteredSongs(filtered);
        } else {
          console.log("No followed users, showing all songs");
          // setFilteredSongs(response.data);
        }
      } catch (error) {
        console.error("Failed to load songs:", error);
        setError('Failed to load songs');
        setAllSongs([]);
        setFilteredSongs([]);
      }
    };
  
    fetchSongs();
  }, [followedUsers]);

  if (isLoading || !userUsername || error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error || 'Please log in to view this page.'}</Text>
      </View>
    );
  }

  const handleUsernamePress = (username) => {
    router.push(`/userProfile/${username}`);
  };

  const renderForYouHeader = () => (
    <TouchableOpacity
      style={[styles.header, !isFollowing ? styles.activeHeader : styles.inactiveHeader]}
      onPress={() => setIsFollowing(false)}
    >
      <Text style={styles.headerText}>For You</Text>
    </TouchableOpacity>
  );

  const renderFollowingHeader = () => (
    <TouchableOpacity
      style={[styles.header, isFollowing ? styles.activeHeader : styles.inactiveHeader]}
      onPress={() => setIsFollowing(true)}
    >
      <Text style={styles.headerText}>Following</Text>
    </TouchableOpacity>
  );

  return (
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: '#121212' }}>
      <PanGestureHandler onGestureEvent={(event) => setIsFollowing(event.nativeEvent.translationX > 100)}>
        <View style={{ flex: 1 }}>
          <View style={styles.headerContainer}>
            {renderFollowingHeader()}
            {renderForYouHeader()}
          </View>

          {isFollowing ? (
            <PaginatedSongs
              songs={filteredSongs}
              handleUsernamePress={handleUsernamePress}
              currentUser={userUsername}
              showEditDelete={false}
            />
          ) : (
            <PaginatedSongs
              songs={allSongs}
              handleUsernamePress={handleUsernamePress}
              currentUser={{ username: userUsername }}
              showEditDelete={false}
            />
          )}
        </View>
      </PanGestureHandler>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
  },
  header: {
    flex: 1,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  activeHeader: {
    backgroundColor: '#1E1E1E',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#121212',
  },
  errorText: {
    fontSize: 18,
    color: '#ff4444',
  },
});

export default Following;
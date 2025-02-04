import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, SafeAreaView, ScrollView, Alert, Linking } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter, useLocalSearchParams } from 'expo-router';  
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import Entypo from '@expo/vector-icons/Entypo';
import PaginatedSongs from '../(main)/PaginatedSongs';  

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
      const response = await axios.get(`http://localhost:8006/api/users/profile/${username}`);
      const profilePictureUrl = response.data.profilePicture
      ? `http://localhost:8006/${response.data.profilePicture}`
      : ''; 

      setUserProfile({
        ...response.data,
        profilePicture: profilePictureUrl,
      });
    } catch (error) {
      console.error('Error fetching profile:', error);
      Alert.alert('Error', 'Failed to load profile');
    }
  };

  const fetchPostedSongs = async () => {
    try {
      const username = id || await AsyncStorage.getItem('username');
      const response = await axios.get(`http://localhost:8006/api/music/getSongs?username=${username}`);
      setPostedSongs(response.data);
    } catch (error) {
      console.error('Error fetching songs:', error);
    }
  };

  const handleEdit = (song) => {
    console.log('Edit action triggered for song:', song);
  };

  const handleDelete = (song) => {
    console.log('Delete action triggered for song:', song);
    Alert.alert(
      "Confirm Delete",
      "Are you sure you want to delete this song?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "OK", 
          onPress: async () => {
            try {
              await axios.delete(`http://localhost:8006/api/music/deleteSong/${song.id}`);
              setPostedSongs(prevSongs => prevSongs.filter(s => s.id !== song.id));
            } catch (error) {
              console.error('Error deleting song:', error);
              Alert.alert('Error', 'Failed to delete song');
            }
          }
        }
      ]
    );
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#121212' }}>
      <ScrollView contentContainerStyle={styles.container} style={{ backgroundColor: '#121212' }}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.editButton}
            onPress={() => router.push('/settings')}
          >
            <Entypo style={styles.editButton} name="dots-three-horizontal" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.username}>@{userProfile.username}</Text>
          {id !== userProfile.username && (
            <TouchableOpacity
              style={styles.editButton}
              onPress={() => router.push('/editProfile')}
            >
              <MaterialIcons name="edit" size={24} color="#fff" />
            </TouchableOpacity>
          )}
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
        <View style={styles.songsContainer}>
          <Text style={styles.sectionTitle}>Posted Songs</Text>
          <PaginatedSongs
            songs={postedSongs}
            handleEdit={handleEdit}
            handleDelete={handleDelete}
            showEditDelete={true}
            isProfilePage={true}  
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

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
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#fff', 
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
    color: '#fff', 
  },
});

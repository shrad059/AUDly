import React, { useState } from 'react';
import { View, TextInput, Text, Button, StyleSheet, Alert, ScrollView, Image, TouchableOpacity } from 'react-native';
import axios from 'axios';
import { useRouter } from 'expo-router';

const Search = () => {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [searchedUser, setSearchedUser] = useState(null);
  const [error, setError] = useState('');

  const searchUser = async () => {
    if (!username.trim()) {
      Alert.alert('Error', 'Please enter a username');
      return;
    }

    try {
      const response = await axios.get(`http://192.168.2.26:8005/api/users/profile/${username}`);
      console.log(response);
      setSearchedUser(response.data);
      setError('');
    } catch (error) {
      console.error('Error fetching user:', error);
      setSearchedUser(null);
      setError('User not found. Please check the username and try again.');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Search User</Text>
      
      <TextInput
        style={styles.searchInput}
        placeholder="Enter username"
        placeholderTextColor="#bbb"
        value={username}
        onChangeText={setUsername}
      />

      <Button title="Search" onPress={searchUser} color="#4CAF50" />

      {error && <Text style={styles.errorText}>{error}</Text>}

      {searchedUser && (
        <View style={styles.userCard}>
          <View style={styles.userInfo}>
            <Image source={{ uri: searchedUser.profilePicture }} style={styles.profilePicture} />
            <View style={styles.textContainer}>
              <Text style={styles.name}>{searchedUser.name}</Text>
              <Text style={styles.username}>@{searchedUser.username}</Text>
            </View>
          </View>
          <TouchableOpacity 
            style={styles.navigateButton} 
            onPress={() => router.push(`/userProfile/${searchedUser.username}`)}
          >
            <Text style={styles.navigateText}>＞</Text>
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 16,
    backgroundColor: '#121212',  
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#fff',  
  },
  searchInput: {
    height: 40,
    borderColor: '#444',  
    borderWidth: 1,
    borderRadius: 5,
    paddingLeft: 10,
    marginBottom: 20,
    color: '#fff',  
  },
  errorText: {
    color: '#ff4d4d',  
    textAlign: 'center',
    marginVertical: 10,
  },
  userCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E1E1E',  
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    justifyContent: 'space-between',
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profilePicture: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 15,
  },
  textContainer: {
    justifyContent: 'center',
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',  
  },
  username: {
    fontSize: 14,
    color: '#bbb', 
  },
  navigateButton: {
    padding: 10,
    backgroundColor: '#4CAF50',
    borderRadius: 5,
  },
  navigateText: {
    color: 'white',
    fontSize: 20,
  },
});

export default Search;

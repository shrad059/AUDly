import React, { useState } from 'react';
import { View, TextInput, Text, Button, StyleSheet, Alert, ScrollView, Image, TouchableOpacity } from 'react-native';
import axios from 'axios';
import { useRouter } from 'expo-router';
import AntDesign from '@expo/vector-icons/AntDesign';

const Search = () => {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [searchedUser, setSearchedUser] = useState(null);
  const [searchedMusic, setSearchedMusic] = useState([]);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('users');

  const search = async () => {
    if (!username.trim()) {
      Alert.alert('Error', 'Please enter a search term');
      return;
    }

    setSearchedUser(null);
    setSearchedMusic([]);

    try {
      try {
        const userResponse = await axios.get(`http://localhost:8006/api/users/profile/${username}`);
        setSearchedUser(userResponse.data);
      } catch (err) {
        console.log('User not found, continuing search for music...');
      }

      const musicResponse = await axios.get(`http://localhost:8006/api/music/search?query=${encodeURIComponent(username)}`);
      setSearchedMusic(musicResponse.data.tracks.items);

      setError('');
    } catch (err) {
      console.error('Error fetching data:', err);
      setError('No results found. Please check the username or music query and try again.');
    }
  };

  const handleAddButtonClick = (song) => {
    const songData = {
      name: song.name,
      artist: song.artists.map(artist => artist.name).join(', '),
      albumArt: song.album.images[0]?.url,
      spotifyLink: song.external_urls.spotify
    };
    console.log("Adding song:", songData);

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
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>to be changed</Text>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Enter username or song name"
          placeholderTextColor="#bbb"
          value={username}
          onChangeText={setUsername}
        />
        <TouchableOpacity style={styles.searchButton} onPress={search}>
          <Text style={styles.searchButtonText}>Search</Text>
        </TouchableOpacity>
      </View>
      
      {error && <Text style={styles.errorText}>{error}</Text>}
      
      <View style={styles.tabsContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'users' && styles.activeTab]}
          onPress={() => setActiveTab('users')}
        >
          <Text style={styles.tabText}>Users</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.tab, activeTab === 'music' && styles.activeTab]}
          onPress={() => setActiveTab('music')}
        >
          <Text style={styles.tabText}>Music</Text>
        </TouchableOpacity>
      </View>

      {activeTab === 'users' && (
        <>
          {searchedUser ? (
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
          ) : (
            <Text style={styles.noResultsText}>No user found</Text>
          )}
        </>
      )}

      {activeTab === 'music' && (
        <>
          {searchedMusic.length > 0 ? (
            <ScrollView contentContainerStyle={styles.scrollView}>
              {searchedMusic.map((item, index) => (
                <View key={item.id} style={styles.card}>
                  <TouchableOpacity
                    style={styles.songContainer}
                    onPress={() => router.push(`/musicDetails/${item.id}`)}
                  >
                    <View style={styles.albumArtContainer}>
                      <Image
                        source={{ uri: item.album?.images[0]?.url }}
                        style={styles.albumArt}
                      />
                      <View style={styles.songInfo}>
                        <Text style={styles.songTitle} numberOfLines={1}>
                          {index + 1}. {item.name.length > 20 ? `${item.name.substring(0, 20)}...` : item.name}
                        </Text>
                        <Text style={styles.artistName} numberOfLines={1}>
                          {item.artists?.map(artist => artist.name).join(', ').length > 20 
                            ? `${item.artists?.map(artist => artist.name).join(', ').substring(0, 20)}...` 
                            : item.artists?.map(artist => artist.name).join(', ')
                          }
                        </Text>
                      </View>
                    </View>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.addButton}
                    onPress={() => handleAddButtonClick(item)}
                  >
                    <AntDesign name="right" size={24} color="black" />
                  </TouchableOpacity>
                </View>
              ))}
            </ScrollView>
          ) : (
            <Text style={styles.noResultsText}>No music results found</Text>
          )}
        </>
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
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  searchInput: {
    height: 40,
    flex: 1,
    borderColor: '#444',
    borderWidth: 1,
    borderRadius: 5,
    paddingLeft: 10,
    color: '#fff',
  },
  searchButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginLeft: 10,
  },
  searchButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  tabsContainer: {
    flexDirection: 'row',
    marginBottom: 20,
    justifyContent: 'space-between',
  },
  tab: {
    flex: 1,
    padding: 10,
    alignItems: 'center',
    backgroundColor: '#333',
    borderRadius: 5,
  },
  activeTab: {
    backgroundColor: '#4CAF50',
  },
  tabText: {
    color: '#fff',
    fontWeight: 'bold',
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
    flexDirection: 'column',
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
    flexDirection: 'row',
    alignItems: 'center',
  },
  addButton: {
    backgroundColor: '#1DB954',
    padding: 12,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  noResultsText: {
    color: '#fff',
    textAlign: 'center',
    marginTop: 20,
  },
  errorText: {
    color: '#ff4d4d',
    textAlign: 'center',
    marginVertical: 10,
  },
});

export default Search;

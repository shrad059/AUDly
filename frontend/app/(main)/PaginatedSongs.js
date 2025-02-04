import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, Linking } from 'react-native';
import axios from 'axios';
import Entypo from '@expo/vector-icons/Entypo';

const truncateText = (text, maxLength = 30) => {
  return text && text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
};

const PaginatedSongs = ({ songs, handleUsernamePress, handleEdit, handleDelete, showEditDelete, isProfilePage, currentUser }) => {
  const [displayedSongs, setDisplayedSongs] = useState([]);
  const [page, setPage] = useState(1);
  const [visibleActionsIndex, setVisibleActionsIndex] = useState(null);
  const [likedSongs, setLikedSongs] = useState(new Set());

  const songsPerPage = 5;

  useEffect(() => {
    if (!currentUser) return;

    const fetchLikedSongs = async () => {
      try {
        const response = await axios.get(`http://localhost:8006/api/users/${currentUser.username}/likedSongs`);
        setLikedSongs(new Set(response.data.map((song) => song._id))); 
      } catch (error) {
        console.error('Error fetching liked songs:', error);
      }
    };
    

    fetchLikedSongs();
  }, [currentUser]);

  useEffect(() => {
    setDisplayedSongs(songs.slice(0, songsPerPage));
  }, [songs]);

  const loadMoreSongs = () => {
    const nextPage = page + 1;
    const nextSongs = songs.slice(0, nextPage * songsPerPage);
    setDisplayedSongs(nextSongs);
    setPage(nextPage);
  };

  const toggleActions = (index) => {
    setVisibleActionsIndex(visibleActionsIndex === index ? null : index);
  };

  const handleLike = async (songId, username) => {
    if (!currentUser) {
      alert("Please log in to like songs.");
      return;
    }

    console.log(`❤️ Toggling like for song ID: ${songId}`);

    try {
      const response = await axios.post('http://localhost:8006/api/music/likeSong', {
        username: currentUser.username,
        songId,
      });

      console.log("✅ Like response:", response.data);

      setLikedSongs((prevLikes) => {
        const updatedLikes = new Set(prevLikes);

        if (response.data.liked) {
          updatedLikes.add(songId); 
        } else {
          updatedLikes.delete(songId);
        }

        return updatedLikes;
      });

    } catch (error) {
      console.error('❌ Error liking song:', error);
      alert("Failed to like the song. Please try again.");
    }
  };

  return (
    <FlatList
      data={displayedSongs}
      keyExtractor={(item, index) => index.toString()}
      renderItem={({ item, index }) => {

        return (
          <View style={styles.songCard}>
            <View style={styles.header}>
              <View style={styles.userInfo}>
                {item.profilePicture && (
                  <Image source={{ uri: item.profilePicture }} style={styles.profilePictureSmall} />
                )}
                <TouchableOpacity onPress={() => handleUsernamePress(item.username)}>
                  <Text style={styles.username}>@{item.username}</Text>
                </TouchableOpacity>
              </View>

              {showEditDelete && (
                <TouchableOpacity style={styles.editButton} onPress={() => toggleActions(index)}>
                  <Entypo name="dots-three-horizontal" size={24} color="#fff" />
                </TouchableOpacity>
              )}

              {visibleActionsIndex === index && (
                <View style={styles.dropdownMenu}>
                  <TouchableOpacity onPress={() => handleEdit(item)} style={styles.actionButton}>
                    <Text style={styles.editText}>Edit</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => handleDelete(item)} style={styles.actionButton}>
                    <Text style={styles.deleteText}>Delete</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>

            {item.comment && <Text style={styles.comment}>{item.comment}</Text>}

            <View style={styles.albumArtContainer}>
              {item.albumArt && <Image source={{ uri: item.albumArt }} style={styles.albumArt} />}
              <View style={styles.songInfo}>
                <Text style={styles.songTitle}>{truncateText(item.songName, 20)}</Text>
                <Text style={styles.artistName}>{truncateText(item.artist, 20)}</Text>
              </View>
            </View>

            <View style={styles.spotifyAndLikeContainer}>
              {item.spotifyLink && (
                <TouchableOpacity onPress={() => Linking.openURL(item.spotifyLink)}>
                  <Text style={styles.spotifyLink}>Listen on Spotify</Text>
                </TouchableOpacity>
              )}

              {!isProfilePage && (
                <TouchableOpacity
                  onPress={() => handleLike(item._id, item.username)}
                  style={styles.likeButton}
                >
                  <Entypo
                    name={likedSongs.has(item._id) ? 'heart' : 'heart-outlined'}
                    size={24}
                    color={likedSongs.has(item._id) ? '#FF0000' : '#fff'}
                  />
                </TouchableOpacity>
              )}
            </View>
          </View>
        );
      }}
      onEndReached={loadMoreSongs}
      onEndReachedThreshold={0.5}
    />
  );
};

const styles = StyleSheet.create({
  songCard: {
    backgroundColor: '#1E1E1E',
    borderRadius: 15,
    padding: 15,
    marginBottom: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  username: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  profilePictureSmall: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  comment: {
    fontSize: 19,
    color: '#ddd',
  },
  albumArtContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  albumArt: {
    width: 120,
    height: 120,
    borderRadius: 8,
  },
  songTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  artistName: {
    fontSize: 16,
    color: '#bbb',
  },
  spotifyAndLikeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  spotifyLink: {
    color: '#1DB954',
    textDecorationLine: 'underline',
  },
  likeButton: {
    paddingLeft: 10,
  },
  dropdownMenu: {
    marginTop: 10,
    backgroundColor: '#2C2C2C',
    borderRadius: 8,
    padding: 5,
    position: 'absolute',
    top: 16,  
    right: 2,
    zIndex: 999,
  },
  actionButton: {
    paddingVertical: 2,
    paddingHorizontal: 2,
    marginBottom: 2,
    borderRadius: 5,
  },

  editText: {
    color: 'white',
    fontSize: 16,
  },

  deleteText: {
    color: 'white',
    fontSize: 16,
  },
});

export default PaginatedSongs;
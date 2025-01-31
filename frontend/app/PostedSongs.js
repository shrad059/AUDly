import React, { useState } from 'react';
import { View, Text, Image, Linking, TouchableOpacity, StyleSheet } from 'react-native';
import { Audio } from 'expo-av';

const PostedSongs = ({ songs }) => {
  const [sound, setSound] = useState(null);

  const playPreview = async (previewUrl) => {
    if (sound) {
      await sound.unloadAsync();
    }
    const { sound: newSound } = await Audio.Sound.createAsync(
      { uri: previewUrl },
      { shouldPlay: true }
    );
    setSound(newSound);
  };

  if (!songs || songs.length === 0) {
    return <Text>No songs available</Text>;
  }

  return (
    <View style={styles.songList}>
      {songs.map((song, index) => (
        <View key={index} style={styles.songItem}>
          <Text style={styles.songName}>{song.songName}</Text>
          <Text style={styles.artist}>{song.artist}</Text>
          {song.albumArt && (
            <Image source={{ uri: song.albumArt }} style={styles.albumArt} />
          )}
          {song.spotifyLink && (
            <Text
              style={styles.spotifyLink}
              onPress={() => Linking.openURL(song.spotifyLink)}>
              Listenn on Spotify
            </Text>
          )}
          {song.previewUrl && (
            <TouchableOpacity
              style={styles.playButton}
              onPress={() => playPreview(song.previewUrl)}>
              <Text style={styles.playButtonText}>Play Preview</Text>
            </TouchableOpacity>
          )}
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  songList: {
    marginTop: 20,
  },
  songItem: {
    marginBottom: 15,
  },
  songName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  artist: {
    fontSize: 16,
    color: 'gray',
  },
  albumArt: {
    width: 100,
    height: 100,
    borderRadius: 10,
    marginTop: 10,
  },
  spotifyLink: {
    color: 'blue',
    marginTop: 5,
  },
  playButton: {
    backgroundColor: '#1E90FF',
    padding: 8,
    borderRadius: 5,
    marginTop: 5,
    alignItems: 'center',
  },
  playButtonText: {
    color: '#fff',
    fontSize: 14,
  },
});

export default PostedSongs;

import React from 'react';
import { View, Text, Image, Linking, StyleSheet } from 'react-native';

const PostedSongs = ({ songs }) => {
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
              Listen on Spotify
            </Text>
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
});

export default PostedSongs;

import React, { useState, useEffect } from "react";
import { 
  View, 
  Text, 
  Image, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  Alert 
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import AsyncStorage from '@react-native-async-storage/async-storage';
// import { Audio } from 'expo-av';  // Import the Audio component from expo-av

export default function PostMusic() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { songName, artist, albumArt, spotifyLink } = params;
  
  const [comment, setComment] = useState("");
  const [sound, setSound] = useState();  // To hold the Audio sound object
  const [previewUrl, setPreviewUrl] = useState("");  // To hold the Deezer preview URL
  const [isPlaying, setIsPlaying] = useState(false);


  // Fetch Deezer song data and preview URL
  const getDeezerSongData = async () => {
    try {
      const response = await fetch(`https://audly.onrender.com/api/music/deezer/search?query=${songName}`);
      const data = await response.json();
      if (data && data.data && data.data.length > 0) {
        const deezerSong = data.data[0];
        setPreviewUrl(deezerSong.preview);  // Set the preview URL from Deezer response
      } else {
        Alert.alert('No results', 'No songs found on Deezer.');
      }
    } catch (error) {
      console.error('Deezer fetch error:', error);
      Alert.alert('Error', 'Something went wrong while fetching from Deezer.');
    }
  };

  useEffect(() => {
    // Fetch Deezer song data when the component mounts
    getDeezerSongData();
  }, []);

  // Function to play the preview
  // const playPreview = async () => {
  //   if (sound) {
  //     await sound.playAsync();
  //     setIsPlaying(true);
  //     return;
  //   }
  //   try {
  //     const { sound: newSound } = await Audio.Sound.createAsync(
  //       { uri: previewUrl },
  //       { shouldPlay: true }
  //     );
  //     setSound(newSound);
  //     setIsPlaying(true);
  //   } catch (error) {
  //     console.error("Error playing sound:", error);
  //     Alert.alert("Error", "Failed to play preview.");
  //   }
  // };

  const pausePreview = async () => {
    if (sound) {
      await sound.pauseAsync();
      setIsPlaying(false);
    }
  };
  useEffect(() => {
    return sound ? () => {
      sound.unloadAsync();
    } : undefined;
  }, [sound]);

  // Make the function async to use `await`
  const handlePostComment = async () => {
    try {
      const username = await AsyncStorage.getItem('username');
      if (!username) {
        Alert.alert('Error', 'No username found. Please log in again.');
        return;
      }

      const data = {
        username: username,
        songName: songName,
        artist: artist,
        albumArt: albumArt,
        spotifyLink: spotifyLink,
        comment: comment,  // Add the comment
        deezerSongLink: previewUrl,  // Deezer link if available
      };

      console.log('data:', data);

      const response = await fetch('https://audly.onrender.com/api/music/addSong', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Failed to add song');
      }

      const result = await response.json();
      console.log(result.message);
      router.push('/profile'); 

      Alert.alert('Success', 'Your comment has been posted!');
    } catch (error) {
      console.error('An error occurred while posting comment:', error);
      Alert.alert('Error', 'Something went wrong. Please try again later.');
    }
  };

  return (
    <View style={styles.container}>
      {/* Back button */}
      <TouchableOpacity onPress={() => router.push("/discover")} style={styles.backButton}>
        <Text style={styles.backText}>{"< Discover"}</Text>
      </TouchableOpacity>

      {/* Music Information */}
      <View style={styles.musicInfo}>
        <Image source={{ uri: albumArt }} style={styles.albumArt} />
        <Text style={styles.songTitle}>{songName}</Text>
        <Text style={styles.artistName}>{artist}</Text>
        <TouchableOpacity onPress={() => router.push({ pathname: spotifyLink })}>
          <Text style={styles.spotifyLink}>Listen on Spotify</Text>
        </TouchableOpacity>
      </View>

      {/* {previewUrl ? (
        <View style={styles.playerContainer}>
          <TouchableOpacity onPress={isPlaying ? pausePreview : playPreview} style={styles.playButton}>
            <Text style={styles.playButtonText}>{isPlaying ? "Pause" : "Play"} Preview</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <Text>Loading preview...</Text>
      )} */}

      {/* Comment Section */}
      <View style={styles.commentSection}>
        <Text style={styles.commentLabel}>Add a description or comment:</Text>
        <TextInput
          style={styles.commentInput}
          value={comment}
          onChangeText={setComment}
          placeholder="Write something..."
          multiline
        />
      </View>

      {/* Post Button */}
      <TouchableOpacity onPress={handlePostComment} style={styles.postButton}>
        <Text style={styles.postButtonText}>POST</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 20,
  },
  backButton: {
    position: "absolute",
    top: 40,
    left: 20,
  },
  backText: {
    fontSize: 16,
    color: "#1E90FF",
    fontWeight: "bold",
  },
  musicInfo: {
    alignItems: "center",
    marginTop: 100,
  },
  albumArt: {
    width: 200,
    height: 200,
    borderRadius: 10,
    marginBottom: 20,
  },
  songTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
  },
  artistName: {
    fontSize: 18,
    color: "#555",
    marginBottom: 10,
  },
  spotifyLink: {
    fontSize: 16,
    color: "#1DB954", // Spotify green color
    textDecorationLine: "underline",
  },
  playerContainer: {
    marginTop: 20,
    alignItems: "center",
  },
  playButton: {
    backgroundColor: "#1E90FF",
    padding: 10,
    borderRadius: 5,
  },
  playButtonText: {
    color: "#fff",
    fontSize: 16,
  },
  commentSection: {
    marginTop: 40,
  },
  commentLabel: {
    fontSize: 16,
    color: "#333",
    marginBottom: 10,
  },
  commentInput: {
    height: 100,
    borderColor: "#ddd",
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
    textAlignVertical: "top",
    backgroundColor: "#f9f9f9",
  },
  postButton: {
    marginTop: 30,
    backgroundColor: "#1E90FF",
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 40,
    alignItems: "center",
  },
  postButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});

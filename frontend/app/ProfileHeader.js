// ProfileHeader.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const ProfileHeader = ({ userProfile }) => {
  return (
    <View style={styles.profileHeader}>
    <img source={{ uri: userProfile.profilePicture }} style={styles.profilePicture} />
    

      <Text style={styles.username}>@{userProfile.username}</Text>
      <Text style={styles.name}>{userProfile.name}</Text>
      <Text style={styles.bio}>{userProfile.bio}</Text>

      {/* Display Followers and Following count */}
      <View style={styles.stats}>
        <Text style={styles.statsText}>Followers: {userProfile.followersCount}</Text>
        <Text style={styles.statsText}>Following: {userProfile.followingCount}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  profileHeader: {
    alignItems: 'center',
    marginTop: 60,
    marginBottom: 30,
  },
  profilePicture: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 15,
  },
  username: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  name: {
    fontSize: 16,
    color: '#666',
    marginBottom: 10,
  },
  bio: {
    textAlign: 'center',
    color: '#444',
    paddingHorizontal: 20,
  },
  stats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 10,
  },
  statsText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#444',
  },
});

export default ProfileHeader;

import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  Button, 
  Alert, 
  Image,
  SafeAreaView, 
  ScrollView, 
  TouchableOpacity 
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import * as FileSystem from 'expo-file-system';

export default function EditProfile() {
  const router = useRouter();
  const [editForm, setEditForm] = useState({
    bio: '',
    profilePicture: '',
    name: '',
    email: '',
  });

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const username = await AsyncStorage.getItem('username');
      if (!username) {
        Alert.alert('Error', 'Please log in again');
        return;
      }

      const response = await axios.get(`http://localhost:8006/api/users/profile/${username}`);
      setEditForm({
        bio: response.data.bio,
        profilePicture: response.data.profilePicture,
        name: response.data.name,
        email: response.data.email,
      });
    } catch (error) {
      console.error('Error fetching profile:', error);
      Alert.alert('Error', 'Failed to load profile');
    }
  };

  const selectPhoto = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Denied', 'We need access to your photos.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setEditForm((prev) => ({ ...prev, profilePicture: result.assets[0].uri }));
    }
  };

  const handleUpdateProfile = async () => {
    try {
      const username = await AsyncStorage.getItem('username');
      let formData = new FormData();
  
      formData.append('username', username);
      formData.append('bio', editForm.bio);
      formData.append('name', editForm.name);
      formData.append('email', editForm.email);
  
      console.log('Profile Picture:', editForm.profilePicture);
  
      if (editForm.profilePicture && typeof editForm.profilePicture === 'string' && editForm.profilePicture.startsWith('data:image')) {
        const blob = await fetch(editForm.profilePicture).then(res => res.blob());
        formData.append('profilePicture', blob, 'profile.jpg');
    } else {
        console.log('No valid profile picture found, skipping upload');
    }
    
  
      console.log('FormData:', formData);
  
      const response = await axios.put(
        'http://localhost:8006/api/users/profile/update',
        formData,
        {
          headers: { 'Content-Type': 'multipart/form-data' },
        }
      );
  
      Alert.alert('Success', 'Profile updated successfully');
      router.push('/profile');
    } catch (error) {
      console.error('Error updating profile:', error.response?.data || error.message);
      Alert.alert('Error', 'Failed to update profile');
    }
  };
  
  

  // const handleUpdateProfile = async () => {
  //   try {
  //     const username = await AsyncStorage.getItem('username');
  //     let formData = new FormData();
  
  //     formData.append('username', username);
  //     formData.append('bio', editForm.bio);
  //     formData.append('name', editForm.name);
  //     formData.append('email', editForm.email);
  
  //     console.log('Profile Picture:', editForm.profilePicture);
  
  //     // Convert Base64 to a file if needed
  //     if (editForm.profilePicture.startsWith('data:image')) {
  //       const fileUri = FileSystem.cacheDirectory + 'profile.jpg';
  
  //       // Convert Base64 to a file and save it temporarily
  //       await FileSystem.writeAsStringAsync(fileUri, editForm.profilePicture.split(',')[1], {
  //         encoding: FileSystem.EncodingType.Base64,
  //       });
  
  //       formData.append('profilePicture', {
  //         uri: fileUri,
  //         name: 'profile.jpg',
  //         type: 'image/jpeg',
  //       });
  //     }
  
  //     console.log('FormData:', formData);
  
  //     const response = await axios.put(
  //       'http://localhost:8006/api/users/profile/update',
  //       formData,
  //       {
  //         headers: { 'Content-Type': 'multipart/form-data' },
  //       }
  //     );
  
  //     Alert.alert('Success', 'Profile updated successfully');
  //     router.push('/profile');
  //   } catch (error) {
  //     console.error('Error updating profile:', error.response?.data || error.message);
  //     Alert.alert('Error', 'Failed to update profile');
  //   }
  // };
  
  

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.header}>Edit Profile</Text>

        <TouchableOpacity onPress={selectPhoto}>
          <Image 
            source={{ uri: editForm.profilePicture || 'https://via.placeholder.com/100' }} 
            style={styles.profileImage} 
          />
        </TouchableOpacity>
        <Text style={styles.changeText}>Tap to change profile picture</Text>

        <TextInput
          style={styles.input}
          value={editForm.name}
          onChangeText={(text) => setEditForm((prev) => ({ ...prev, name: text }))}
          placeholder="Name"
        />

        <TextInput
          style={styles.input}
          value={editForm.email}
          onChangeText={(text) => setEditForm((prev) => ({ ...prev, email: text }))}
          placeholder="Email"
          keyboardType="email-address"
        />

        <TextInput
          style={styles.bioInput}
          value={editForm.bio}
          onChangeText={(text) => setEditForm((prev) => ({ ...prev, bio: text }))}
          placeholder="Bio"
          multiline
        />

        <View style={styles.buttons}>
          <Button title="Save Changes" onPress={handleUpdateProfile} />
          <Button title="Cancel" color="gray" onPress={() => router.push('/profile')} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 16,
    backgroundColor: 'white',
    alignItems: 'center',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignSelf: 'center',
    marginBottom: 10,
    borderWidth: 2,
    borderColor: '#ddd',
  },
  changeText: {
    fontSize: 14,
    color: 'gray',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
  },
  bioInput: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
    height: 100,
    textAlignVertical: 'top',
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginTop: 20,
  },
});

import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  Button, 
  Image, 
  Alert, 
  TouchableOpacity, 
  SafeAreaView, 
  ScrollView 
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';

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

      const response = await axios.get(`http://192.168.2.26:8005/api/users/profile/${username}`);
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

  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });

      if (!result.canceled) {
        setEditForm((prev) => ({
          ...prev,
          profilePicture: result.assets[0].uri,
        }));

      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Failed to pick image');
    }
  };

  const handleUpdateProfile = async () => {
    try {
      const username = await AsyncStorage.getItem('username');
      let profilePictureUrl = editForm.profilePicture;
      if (typeof profilePictureUrl === 'object') {
        
      }

      const response = await axios.put('http://192.168.2.26:8005/api/users/profile/update', {
        username,
        ...editForm,
      });
      

      Alert.alert('Success', 'Profile updated successfully');
      router.push('/profile'); // Navigate back to profile screen
    } catch (error) {
      console.error('Error updating profile:', error);
      Alert.alert('Error', 'Failed to update profile');
    }
  };
//   let imageSource = setEditForm.image && typeOf setEditForm.image == 'object' ? user.image.uri :getUserImageSrc(setEditForm.image);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.header}>Edit Profile</Text>

        <TouchableOpacity style={styles.imagePickerButton} onPress={pickImage}>
          <Text style={styles.imagePickerButtonText}>Change Profile Picture</Text>
        </TouchableOpacity>

        {editForm.profilePicture && (
          <Image 
            source={{ uri: editForm.profilePicture }} 
            style={styles.previewImage} 
          />
        )}

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
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
  },
  bioInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
    height: 100,
    textAlignVertical: 'top',
  },
  imagePickerButton: {
    backgroundColor: '#4CAF50',
    padding: 12,
    borderRadius: 5,
    marginBottom: 15,
    alignItems: 'center',
  },
  imagePickerButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  previewImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignSelf: 'center',
    marginBottom: 15,
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
  },
});

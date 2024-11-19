import React, { useEffect } from 'react';
import { View, Text, Button, StyleSheet, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Logout = () => {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      // Clear the AsyncStorage
      await AsyncStorage.removeItem('userToken');
      await AsyncStorage.removeItem('username');
      Alert.alert('Logged Out', 'You have been successfully logged out.');
      
      // Navigate to the login page
      router.replace('/login');
    } catch (error) {
      console.error('Logout failed:', error);
      Alert.alert('Error', 'Failed to logout. Please try again.');
    }
  };

  useEffect(() => {
    // Optional: Automatically log out when the user lands on this page
    handleLogout();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Logout</Text>
      <Text style={styles.subtitle}>You are being logged out...</Text>
      <Button title="Back to Login" onPress={() => router.replace('/login')} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#555',
    marginBottom: 20,
  },
});

export default Logout;

import React, { useState } from 'react';
import { Text, TextInput, Button, View, StyleSheet, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

// You can replace this with your actual login API function
import { loginUser } from '../services/api.js';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter(); // Initialize the useRouter hook

  const handleLogin = async () => {
    try {
      const response = await loginUser(email, password);
      console.log("API Response:", response); // Log the full response object
      
      // Check if token exists directly in the response object
      const token = response?.token;
      const username = response?.username;

      if (!token) {
        throw new Error('Token not found in response');
      }
  
      console.log("username:", response?.username);  // Log the token to ensure it's being accessed correctly
  
      // Save the token to AsyncStorage
      await AsyncStorage.setItem('userToken', token);
      await AsyncStorage.setItem('username', username);  // Save the username
      Alert.alert('Login Successful!', 'You are logged in.');
      router.push('/profile'); // Navigate to the Profile screen
    } catch (error) {
      console.error('Login failed:', error);
      Alert.alert('Error', 'Login failed. Please try again.');
    }
  };
  
  
  
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>

      {/* Email input */}
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />

      {/* Password input */}
      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <Button title="Login" onPress={handleLogin} />
      <Button title="Don't have an account? Register" onPress={() => router.push('/register')} />
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
    marginBottom: 20,
  },
  input: {
    width: '100%',
    padding: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
  },
});

export default Login;

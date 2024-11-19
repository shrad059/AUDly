import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';  

const Settings = () => {
    const router = useRouter();
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Settings</Text>
      
      {/* Notification Option */}
      <TouchableOpacity style={styles.option}>
        <Text style={styles.optionText}>Notifications</Text>
      </TouchableOpacity>

      {/* Blocked Users Option */}
      <TouchableOpacity style={styles.option}>
        <Text style={styles.optionText}>Blocked Users</Text>
      </TouchableOpacity>

      {/* Contact Us Option */}
      <TouchableOpacity style={styles.option}>
        <Text style={styles.optionText}>Contact Us</Text>
      </TouchableOpacity>

      {/* Terms and Conditions Option */}
      <TouchableOpacity style={styles.option}>
        <Text style={styles.optionText}>Terms and Conditions</Text>
      </TouchableOpacity>

      {/* Privacy Policy Option */}
      <TouchableOpacity style={styles.option}>
        <Text style={styles.optionText}>Privacy Policy</Text>
      </TouchableOpacity>

      {/* Logout Button */}
      <TouchableOpacity style={styles.logoutButton} onPress={() => router.push('/logout')}>
        <Text style={styles.logoutText}>LOGOUT</Text>
        </TouchableOpacity>
    </ScrollView>
  );
};

export default Settings;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9F9F9',
    paddingHorizontal: 20,
    paddingTop: 30,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 20,
    color: '#333',
    textAlign: 'center',
  },
  option: {
    backgroundColor: '#FFFFFF',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  optionText: {
    fontSize: 16,
    color: '#555',
  },
  logoutButton: {
    marginTop: 20,
    backgroundColor: '#FF5C5C',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  logoutText: {
    fontSize: 16,
    color: '#FFF',
    fontWeight: '600',
  },
});

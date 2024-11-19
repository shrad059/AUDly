import { View, Text, Button } from 'react-native';
import React from 'react';
import { Tabs } from 'expo-router'; 
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import Fontisto from '@expo/vector-icons/Fontisto';

const TabsLayout = () => {
  return (
    <>
      <Tabs
        screenOptions={{
          tabBarStyle: {
            backgroundColor: '#121212', // Dark background color for tab bar
            borderTopColor: '#333', // Light grey border to differentiate the tab bar
          },
        }}
      >
        <Tabs.Screen
          name="following"
          options={{
            title: '',
            headerShown: false,
            tabBarIcon: ({ focused }) => (
              <Fontisto name="applemusic" size={24} color={focused ? '#e0e0e0' : '#bbb'} />
            ),
          }}
        />
        <Tabs.Screen
          name="discover"
          options={{
            title: '',
            headerShown: false,
            tabBarIcon: ({ focused }) => (
              <FontAwesome6 name="compact-disc" size={24} color={focused ? '#e0e0e0' : '#bbb'} />
            ),
          }}
        />
        <Tabs.Screen
          name="search"
          options={{
            title: '',
            headerShown: false,
            tabBarIcon: ({ focused }) => (
              <FontAwesome6 name="magnifying-glass" size={24} color={focused ? '#e0e0e0' : '#bbb'} />
            ),
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: '',
            headerShown: false,
            tabBarIcon: ({ focused }) => (
              <FontAwesome5 name="user" size={24} color={focused ? '#e0e0e0' : '#bbb'} />
            ),
          }}
        />
      </Tabs>
    </>
  );
}

export default TabsLayout;

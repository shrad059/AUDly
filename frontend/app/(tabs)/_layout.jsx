import { View } from 'react-native';
import React from 'react';
import { Tabs } from 'expo-router';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import Fontisto from '@expo/vector-icons/Fontisto';

const TabsLayout = () => {
  return (
    <View style={{ flex: 1, paddingTop: 50, backgroundColor: '#121212' }}> 
      <Tabs
        screenOptions={{
          tabBarStyle: {
            backgroundColor: '#121212',
            borderTopColor: '#333',
          },
        }}
      >
        <Tabs.Screen
          name="following"
          options={{
            title: '',
            headerShown: false,
            tabBarIcon: ({ focused }) => (
              // <FontAwesome6 name="compact-disc" size={24} color={focused ? '#e0e0e0' : '#bbb'} />
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
    </View>
  );
}

export default TabsLayout;

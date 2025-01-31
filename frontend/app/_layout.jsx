import { View, Text, Button } from 'react-native';
import React from 'react';
import { Stack } from 'expo-router';

const _layout = () => {
  return (
    <View style={{ flex: 1, paddingTop: 40, backgroundColor: '#121212',
    }}>  
      <Stack
        screenOptions={{
          headerShown: false,
        }}
      />
    </View>
  );
};

export default _layout;

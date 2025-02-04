import React, { useState, useEffect } from 'react';
import { View, Text, Button, FlatList } from 'react-native';
import axios from 'axios';

const Followers = ({ route }) => {
  const [followers, setFollowers] = useState([]);
  const { username } = route.params;

  useEffect(() => {
    const fetchFollowers = async () => {
      try {
        
        // const response = await axios.get(`http://localhost:8006/api/users/followers/${username}`);

        const response = await axios.get(`http://localhost:8006/api/users/followers/${username}`);
        setFollowers(response.data);
      } catch (error) {
        console.error('Error fetching followers:', error);
      }
    };

    fetchFollowers();
  }, [username]);

  return (
    <View>
      <Text>Followers of {username}:</Text>
      <FlatList
        data={followers}
        renderItem={({ item }) => <Text>{item.username}</Text>}
        keyExtractor={(item) => item._id}
      />
    </View>
  );
};

export default Followers;

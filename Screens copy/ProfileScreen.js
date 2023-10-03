import React from 'react';
import { Text, Button } from 'react-native';

const ProfileScreen = ({ navigation, route }) => {
  return (
    <>
      <Text style={{fontSize:50}}>This is {route.params.name}</Text>
      <Text style={{fontSize:50}}>This is {route.params.id}</Text>
      <Button
        title="Go to Third Screen"
        onPress={() => navigation.navigate('ThirdScreen')}
      />
    </>
  );
};

export default ProfileScreen;

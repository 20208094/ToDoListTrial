import React from 'react';
import { Text, Button } from 'react-native';

const ThirdScreen = ({ navigation }) => {
  return (
    <>
      <Text style={{fontSize:50}}>This is the Third Screen</Text>
      <Button
        title="Go back to Home Screen"
        onPress={() => navigation.navigate('Home')}
      />
    </>
  );
};

export default ThirdScreen;

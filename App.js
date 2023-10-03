// 



import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { Button, View, Text, FlatList } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ProfileScreen from './Screens/ProfileScreen';
import ThirdScreen from './Screens/ThirdScreen'; 

const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ title: 'Welcome' }}
        />
        <Stack.Screen name="Profile" component={ProfileScreen} />
        <Stack.Screen name="ThirdScreen" component={ThirdScreen} />
      </Stack.Navigator>
      <StatusBar style="auto" />
    </NavigationContainer>
  );
};

const dummyData = [
      {
          id: "01",
          title: "Wash Car"
      }, {
          id: "02",
          title: "Dry Clothes"
      }, {
        id: "03",
        title: "zzzzzzzzzz"
    },
  ];

  const renderTodos = ({ item, index, navigation }) => {
    return (
      <View style={{ backgroundColor: "#1e90ff", borderRadius: 6, paddingHorizontal: 6, paddingVertical: 12, marginBottom: 12, flexDirection: 'row', alignItems: "center" }}>
        <Button
          title={item.title} // Make sure item.title is a string
          onPress={() => navigation.navigate('Profile', { name: item.title , id: item.id })}
        />
      </View>
    );
  }
  
  const HomeScreen = ({ navigation }) => {
    return (
      <>
        <Text style={{ fontSize: 50 }}>This is HOME</Text>
        <Button
          title="Go to Zhenzy's profile"
          onPress={() => navigation.navigate('Profile', { name: 'Zhenzy' })}
        />
  
        {/* RENDER TO DO LIST */}
        <FlatList data={dummyData} renderItem={({ item, index }) => renderTodos({ item, index, navigation })} />
      </>
    );
  };
  
  export default App;
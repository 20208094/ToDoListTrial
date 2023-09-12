import { StatusBar } from 'expo-status-bar';
import React, { Component } from 'react';
import { StyleSheet, Text, View, SafeAreaView } from 'react-native';
import SplashScreen from 'react-native-splash-screen'
import TodoScreen from './src/screen/TodoScreen';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

export default function App() {
  
  const Stack = createNativeStackNavigator();
  return (
    // <SafeAreaView>
    //   <View>
    //     {/* <Text>Open up App.js to start working on your app!</Text>
    //     <StatusBar style="auto" /> */}
    //     {/* <TodoScreen/> */}
    //     <ListView />
    //   </View>
    // </SafeAreaView>
    <NavigationContainer>
      <Stack.Navigator screenOptions={{headerShown: false}}>
        <Stack.Screen name="Home" component={TodoScreen} />
      </Stack.Navigator>
  </NavigationContainer>

  );
}

const styles = StyleSheet.create({});

import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View, SafeAreaView } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import BottomTab from './src/navigation/BottomTab';
export default function App() {
  return (
    // <SafeAreaView>
    //   <View>
    //     {/* <Text>Open up App.js to start working on your app!</Text>
    //     <StatusBar style="auto" /> */}
    //     {/* <TodoScreen/> */}
    //     <ListView />
    //   </View>
    // </SafeAreaView>
    <BottomTab/>


  );
}

const styles = StyleSheet.create({
});

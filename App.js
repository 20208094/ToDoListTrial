import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View, SafeAreaView } from 'react-native';
import TodoScreen from './src/screen/TodoScreen';

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

    <SafeAreaView>
      <View>
        <StatusBar style="auto" />
        <TodoScreen />
      </View>
    </SafeAreaView>

  );
}

const styles = StyleSheet.create({});

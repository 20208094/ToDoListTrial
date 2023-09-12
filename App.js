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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    padding: 20,
  },
  navigationMenu: {
    position: 'absolute',
    top: 20,
    left: 20,
  },
  navigationIcon: {
    fontSize: 24,
  },
  mobileNavbar: {
    backgroundColor: 'lightgray',
    padding: 10,
  },
  taskText: {
    textAlign: 'center',
    fontSize: 24,
    color: 'black',
    marginTop: 20,
  },
  containerPink: {
    backgroundColor: '#FC5858',
    flex: 1,
    padding: 20,
    borderRadius: 20,
    position: 'relative',
  },
  rowContainer: {
    flex: 1,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
    backgroundColor: 'white',
    borderRadius: 20,
  },
  checkboxCircle: {
    width: 20,
    height: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    marginLeft: 10,
    borderWidth: 2,
    borderColor: 'black',
  },
  checkedCircle: {
    backgroundColor: 'green',
  },
  checkmark: {
    fontSize: 16,
    color: 'white',
    textAlign: 'center',
  },
  rowText: {
    fontSize: 18,
    color: 'black',
    flex: 1,
  },
  addButton: {
    position: 'absolute',
    bottom: 1,
    right: 1,
  },
  plusCircle: {
    backgroundColor: '#FC5858',
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'white',
    position: 'absolute',
    bottom: 20,
    right: 20,
  },
  plusSign: {
    fontSize: 44,
    color: 'white',
  },
});

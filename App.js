import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View, SafeAreaView } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
//Imported Screens
import TodoScreen from './src/screen/TodoScreen';
import AddScreen from './src/screen/AddScreen';
import EditScreen from './src/screen/EditScreen';
import AnalyticsScreen from './src/screen/AnalyticsScreen';
import ArchiveScreen from './src/screen/ArchiveScreen';
import DB from './src/database/practice';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{
        animation: 'none',
        headerShown: false
      }}>
        <Stack.Screen name="Todo" component={TodoScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Add" component={AddScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Edit" component={EditScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Analytics" component={AnalyticsScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Archive" component={ArchiveScreen} options={{ headerShown: false }} />
        <Stack.Screen name="DB" component={DB} options={{ headerShown: false }} />
      </Stack.Navigator>
      <StatusBar style="auto" />
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
});

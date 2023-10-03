import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import TodoScreen from '../screen/TodoScreen';
import AddListScreen from '../screen/AddListScreen';

const Tab = createBottomTabNavigator();

export default function BottomTab() {
  return (
    <Tab.Navigator initialRouteName="Home">
      <Tab.Screen name="Home" component={TodoScreen} />
      <Tab.Screen name="Add Assignment" component={AddListScreen} />
    </Tab.Navigator>
  )
}

const styles = StyleSheet.create({})
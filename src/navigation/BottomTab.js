import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import TodoScreen from '../screen/TodoScreen';
import AddListScreen from '../screen/AddListScreen';
import AnalyticsScreen from '../screen/AnalyticsScreen';
import { NavigationContainer } from '@react-navigation/native';

const Tab = createBottomTabNavigator();

export default function BottomTab() {
  return (
    <NavigationContainer>
        <Tab.Navigator initialRouteName="Home">
          <Tab.Screen name="Home" component={TodoScreen} />
          <Tab.Screen name="Add Assignment" component={AddListScreen} />
          <Tab.Screen name="Analytics" component={AnalyticsScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  )
}

const styles = StyleSheet.create({})


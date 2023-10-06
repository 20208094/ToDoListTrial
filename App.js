// import React from 'react';
// import { StatusBar } from 'expo-status-bar';
// import { NavigationContainer } from '@react-navigation/native';
// import { Button, View, Text, FlatList } from 'react-native';
// import { createNativeStackNavigator } from '@react-navigation/native-stack';
// import BottomTab from './src/navigation/BottomTab';
// // import ProfileScreen from './Screens/ProfileScreen';
// // import ThirdScreen from './Screens/ThirdScreen'; 
// import TodoScreen from './src/screen/TodoScreen';

// const Stack = createNativeStackNavigator();

// const App = () => {
//   return (
//     <NavigationContainer>
//       <Stack.Navigator>
//         <Stack.Screen name="TodoScreen" component={TodoScreen}/>
//       </Stack.Navigator>
//       <StatusBar style="auto" />
//     </NavigationContainer>
    
//   );
// };

//   export default App;

import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import TodoScreen from './src/screen/TodoScreen';
import AddListScreen from './src/screen/AddListScreen';
import AnalyticsScreen from './src/screen/AnalyticsScreen';
import BottomTab from './src/navigation/BottomTab';

import TryApp from './src/screen/Try';

const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Todo" component={TodoScreen} options={{ headerShown: false }}/>
        {/* <Stack.Screen name="TryApp" component={TryApp} options={{ headerShown: false }}/> */}
        <Stack.Screen name="Add" component={AddListScreen} options={{ headerShown: false }}/>
        <Stack.Screen name="Analytics" component={AnalyticsScreen} options={{ headerShown: false }}/>
      </Stack.Navigator>
      <StatusBar style="auto" />
    </NavigationContainer>
  );
};

export default App;

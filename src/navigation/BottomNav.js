import React from 'react';
import { View, TouchableOpacity, Image, StyleSheet } from 'react-native';
import houseImage from '../../assets/house.png';
import graphImage from '../../assets/graph.png';
import doubleCheck from '../../assets/doubleCheck.png';
import { LinearGradient } from 'expo-linear-gradient';
import { useRoute } from '@react-navigation/native';

const BottomNavigation = ({ navigation }) => {
  const route = useRoute();

  const getButtonStyle = (screenName) => ({
    ...styles.ButtonContainer,
    backgroundColor: route.name === screenName ? 'maroon' : '#FC5858',
    borderWidth: route.name === screenName ? 3 : 0,
    borderColor: 'white',
    width: route.name === screenName ? 55 : 50,
    height: route.name === screenName ? 55 : 50,
  });

  return (
    <LinearGradient colors={['#FC5858', 'pink', 'pink', 'pink', '#FC5858']} style={styles.bottomContainer}>
      {/* ARCHIVE BUTTON */}
      <TouchableOpacity style={getButtonStyle('Archive')} onPress={() => navigation.navigate('Archive')}>
        <Image source={doubleCheck} style={styles.icon} />
      </TouchableOpacity>

      {/* TODO SCREEN BUTTON */}
      <TouchableOpacity style={getButtonStyle('Todo')} onPress={() => navigation.navigate('Todo')}>
        <Image source={houseImage} style={styles.icon} />
      </TouchableOpacity>

      {/* ANALYTICS BUTTON */}
      <TouchableOpacity style={getButtonStyle('Analytics')} onPress={() => navigation.navigate('Analytics')}>
        <Image source={graphImage} style={styles.icon} />
      </TouchableOpacity>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  bottomContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    borderRadius: 15,
    padding: 10,
    alignItems: 'center',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingStart: 40,
    paddingEnd: 40,
  },
  iconContainer: {
    alignItems: 'center',
    borderRadius: 50,
    padding: 10,
  },
  icon: {
    width: 30,
    height: 30,
    borderRadius: 15,
  },
  ButtonContainer: {
    borderRadius: 50,
    padding: 10,
    width: 50,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default BottomNavigation;

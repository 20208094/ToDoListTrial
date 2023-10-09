import React from 'react';
import { View, TouchableOpacity, Image, StyleSheet } from 'react-native';
import houseImage from '../../assets/house.png';
import addImage from '../../assets/add.png';
import graphImage from '../../assets/graph.png';
import doubleCheck from '../../assets/doubleCheck.png';
import { LinearGradient } from 'expo-linear-gradient';

const BottomNavigation = ({ navigation }) => {
  return (
    <LinearGradient colors={['#FC5858', 'pink']} style={styles.bottomContainer}>
      <TouchableOpacity style={styles.ButtonContainer} onPress={() => navigation.navigate('Todo')}>
        <Image source={houseImage} style={styles.icon} />
      </TouchableOpacity>
      
      <TouchableOpacity style={styles.ButtonContainer} onPress={() => navigation.navigate('Add')}>
        <Image source={addImage} style={styles.icon} />
      </TouchableOpacity>

      <TouchableOpacity style={styles.ButtonContainer} onPress={() => navigation.navigate('Analytics')}>
        <Image source={graphImage} style={styles.icon} />
      </TouchableOpacity>

      <TouchableOpacity style={styles.ButtonContainer} onPress={() => navigation.navigate('Archive')}>
        <Image source={doubleCheck} style={styles.icon} />
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
    backgroundColor: '#FC5858',
    borderRadius: 50,
    padding: 10,
    width: 50,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'white',
  },
});

export default BottomNavigation;



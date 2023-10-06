import React from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet } from 'react-native';

// import houseImage from './house.png';
// import analyticsImage from './analytics.png';

const TryApp = () => {
  return (
    <View style={styles.container}>
      {/* Title Container */}
      <View style={styles.titleContainer}>
        <Text style={styles.titleText}>Assignment Apps</Text>
      </View>

      {/* Add Task Note Container */}
      <View style={styles.noteContainer}>
        <Text style={styles.noteText}>Add Task</Text>
      </View>

      {/* New Container */}
      <View style={styles.newContainer}>
        {/* Title */}
        <Text style={styles.subtitle}>Title:</Text>
        <TextInput style={styles.input} />

        {/* Due */}
        <Text style={[styles.subtitle, { marginTop: 10 }]}>Due:</Text>
        <TextInput style={styles.input} />

        {/* Task Description */}
        <Text style={[styles.subtitle, { marginTop: 10 }]}>Task Description:</Text>
        <TextInput style={[styles.input, { padding: 55, marginBottom: 10 }]} />

        {/* Buttons Container */}
        <View style={styles.buttonsContainer}>
          {/* Add Button */}
          <TouchableOpacity style={styles.addButton}>
            <Text style={styles.buttonText}>Add</Text>
          </TouchableOpacity>

          {/* Cancel Button */}
          <TouchableOpacity style={styles.cancelButton}>
            <Text style={styles.cancelbuttonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Bottom Navigation Container */}
      <View style={styles.bottomContainer}>
        <TouchableOpacity style={styles.iconContainer}>
          <Image source={analyticsImage} style={styles.icon} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconContainer}>
          <Image source={houseImage} style={styles.icon} />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.addButtonContainer}
          onPress={() => {
            // Handle onPress event here
          }}
        >
          <Text style={styles.plusbuttonText}>+</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    padding: 20,
  },
  titleContainer: {
    backgroundColor: 'pink',
    borderRadius: 15,
    padding: 10,
    alignSelf: 'flex-start',
    marginBottom: 10,
  },
  titleText: {
    color: 'black',
    fontSize: 20,
  },
  noteContainer: {
    backgroundColor: 'pink',
    borderRadius: 15,
    padding: 10,
    alignSelf: 'center',
    marginBottom: 10,
  },
  noteText: {
    color: 'black',
    fontSize: 18,
  },
  newContainer: {
    backgroundColor: 'pink',
    borderRadius: 15,
    padding: 20,
  },
  subtitle: {
    color: 'black',
    fontSize: 16,
    marginBottom: 10,
  },
  input: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  addButton: {
    backgroundColor: '#B94D4D',
    borderRadius: 15,
    padding: 10,
    flex: 1,
    marginRight: 5,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 10,
    flex: 1,
    marginLeft: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
  },
  cancelbuttonText: {
    color: 'black',
  },
  plusbuttonText: {
    color: 'white',
    fontSize: 30,
  },
  bottomContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    backgroundColor: 'pink',
    borderRadius: 15,
    padding: 10,
    alignItems: 'center',
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
  addButtonContainer: {
    backgroundColor: '#B94D4D',
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

export default TryApp;

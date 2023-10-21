import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Button, StyleSheet } from 'react-native';
import { insertItem } from './Database';
import { LinearGradient } from 'expo-linear-gradient';
import { Dimensions } from 'react-native';
import BottomNavigation from '../navigation/BottomNav';

const AddScreen = ({ navigation }) => {
  const [itemName, setItemName] = useState('');
  const [itemDescription, setItemDescription] = useState('');
  const [itemMins, setItemMins] = useState('');
  const [itemDueDate, setItemDueDate] = useState('');
  const [itemDueTime, setItemDueTime] = useState('');
  const [minsError, setMinsError] = useState(null);
  const { height, width } = Dimensions.get('window');
  const [titleError, setTitleError] = useState(null);

  const addItem = () => {
    if (!itemName.trim()) {  // Check if itemName is empty or just whitespace
      setTitleError('You need to write a title');
      return;  // Return early so the insert action doesn't proceed
    } else {
      setTitleError(null);  // Clear any previous error
    }
    insertItem(
      itemName,
      itemDescription,
      itemMins,
      itemDueDate,
      itemDueTime,
      (id) => {
        console.log('Item added with ID:', id);
        navigation.navigate('Todo', { refreshKey: 'todo' + Math.random() });
      }
    );
  };

  const validateMins = (input) => {
    const minsPattern = /^[0-9]*$/;
  
    if (!minsPattern.test(input) || input < 0 || input > 60) {
      setMinsError('Please enter a valid number between 0 and 60');
    } else {
      setMinsError(null);
      setItemMins(input);
    }
  };

  const handleCancel = () => {
    // Navigate back to the previous screen
    navigation.goBack();
  };
  

  return (
    <>
      <View style={styles.container}>
        {/* Add Task Note Container */}
        <LinearGradient colors={['#FC5858', 'pink']} style={styles.noteContainer}>
          <Text style={styles.noteText}>Add Task</Text>
        </LinearGradient>

        {/* New Container */}
        <LinearGradient colors={['#FC5858', 'pink']} style={styles.newContainer}>
          {/* Title */}
          <Text style={styles.subtitle}>Title</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter item title"
            value={itemName}
            onChangeText={(text) => setItemName(text)}
          />
          {titleError && <Text style={styles.errorText}>{titleError}</Text>}

          {/* Due Date */}
          <Text style={styles.subtitle}>Due Date</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter item due date (YYYY-MM-DD)"
            value={itemDueDate}
            onChangeText={(text) => setItemDueDate(text)}
          />

          {/* Due Time */}
          <Text style={styles.subtitle}>Due Time</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter item due time (HH:mm:ss)"
            value={itemDueTime}
            onChangeText={(text) => setItemDueTime(text)}
          />

          {/* Minutes */}
          <Text style={styles.subtitle}>Minutes</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter item minutes"
            value={itemMins}
            onChangeText={(text) => validateMins(text)}
            keyboardType="numeric"
          />
          {minsError && <Text style={styles.errorText}>{minsError}</Text>}

          {/* Task Description */}
          <Text style={[styles.subtitle, { marginTop: 10 }]}>Task Description</Text>
          <TextInput
            style={[styles.input, { height: 100, textAlignVertical: 'top' }]}
            placeholder="Enter item description"
            value={itemDescription}
            onChangeText={(text) => setItemDescription(text)}
          />

          {/* Buttons Container */}
          <View style={styles.buttonsContainer}>
            {/* Add Button */}
            <TouchableOpacity style={styles.addButton} onPress={addItem}>
              <Text style={styles.buttonText}>Add</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
              <Text style={styles.cancelbuttonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </LinearGradient>

        {/* Bottom Navigation Container */}
        <View style={{ width: width, position: 'absolute', right: 0, left: 0, bottom: 0, flex: 1 }}>
          <BottomNavigation navigation={navigation} />
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    padding: 20,
    paddingTop: 40,
    justifyContent: 'center', // Center content vertically
    alignItems: 'center', // Center content horizontally
  },
  noteContainer: {
    borderRadius: 15,
    backgroundColor: 'pink',
    padding: 10,
    alignItems: 'center',
    marginBottom: 10,
    width: '40%',
  },
  noteText: {
    color: 'black',
    fontSize: 18,
  },
  newContainer: {
    backgroundColor: 'pink',
    borderRadius: 15,
    padding: 20,
    width: '90%',
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
    color: 'black'
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  addButton: {
    backgroundColor: '#FC5858',
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
  datePicker: {
    height: 120,
    marginTop: -10
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginBottom: 10,
  }
});

export default AddScreen;

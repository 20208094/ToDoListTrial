import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Pressable, Button } from 'react-native';
import { updateItem, getItemById } from './Database';
import BottomNavigation from '../navigation/BottomNav';

const EditScreen = ({ route, navigation }) => {
  const { itemId } = route.params;
  const [itemName, setItemName] = useState('');
  const [itemDescription, setItemDescription] = useState('');
  const [itemMins, setItemMins] = useState('');
  const [itemDueDate, setItemDueDate] = useState('');
  const [itemDueTime, setItemDueTime] = useState('');
  const [minsError, setMinsError] = useState(null);

  useEffect(() => {
    getItemById(itemId, (item) => {
      setItemName(item.name);
      setItemDescription(item.description);
      setItemMins(item.mins.toString());
      setItemDueDate(item.duedate);
      setItemDueTime(item.duetime);
    });
  }, [itemId]);

  const editItem = () => {
    updateItem(
      itemId,
      itemName,
      itemDescription,
      itemMins,
      itemDueDate,
      itemDueTime,
      () => {
        console.log('Item updated successfully');
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

  return (
    <>
      <View style={styles.container}>
        <View style={styles.noteContainer}>
          <Text style={styles.noteText}>Edit Task</Text>
        </View>

        <View style={styles.newContainer}>
          {/* TITLE */}
          <Text style={styles.subtitle}>Title</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter item title"
            value={itemName}
            onChangeText={(text) => setItemName(text)}
          />

          {/* DUE DATE */}
          <Text style={styles.subtitle}>Title</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter item due date (YYYY-MM-DD)"
            value={itemDueDate}
            onChangeText={(text) => setItemDueDate(text)}
          />

          {/* DUE TIME */}
          <Text style={styles.subtitle}>Title</Text>
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
          />
          {minsError && <Text style={styles.errorText}>{minsError}</Text>}

          {/* DESCRIPTION */}
          <Text style={[styles.subtitle, { marginTop: 10 }]}>Task Description</Text>

          <TextInput
            style={[styles.input, { height: 100, textAlignVertical: 'top' }]}
            placeholder="Enter item description"
            multiline={true}
            value={itemDescription}
            onChangeText={(text) => setItemDescription(text)}
          />

          <View style={styles.buttonsContainer}>
            <TouchableOpacity style={styles.addButton} onPress={() => editItem()}>
              <Text style={styles.buttonText}>Edit</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.cancelButton} onPress={() => handleCancel()}>
              <Text style={styles.cancelbuttonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>

        <BottomNavigation navigation={navigation} />
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
    justifyContent: 'center',
    alignItems: 'center',
  },
  noteContainer: {
    backgroundColor: 'pink',
    borderRadius: 15,
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
  errorText: {
    color: 'red',
    fontSize: 12,
    marginBottom: 10,
  }
});

export default EditScreen;

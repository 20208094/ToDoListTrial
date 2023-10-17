import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, DatePickerIOS, Pressable, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import BottomNavigation from '../navigation/BottomNav';
import DateTimePicker from "@react-native-community/datetimepicker";
import { LinearGradient } from 'expo-linear-gradient';
import { Dimensions } from 'react-native';

// Import SQLite
import * as SQLite from 'expo-sqlite';

// Open the SQLite database
const db = SQLite.openDatabase('db.assignmentDB');

const AddScreen = ({ navigation }) => {
  const [todo, setTodo] = useState("");
  const [desc, setDesc] = useState("");
  const [mins, setMins] = useState(0);
  const [minsError, setMinsError] = useState(null);
  const [todoList, setTodoList] = useState([]);
  const { height, width } = Dimensions.get('window');
  // date
  const [due, setDue] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  // time
  const [time, setTime] = useState(new Date());
  const [showTimePicker, setshowTimePicker] = useState(false);

  // Function to create the table
  const createTable = () => {
    db.transaction((tx) => {
      tx.executeSql(
        'CREATE TABLE IF NOT EXISTS todos (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT, due TEXT, mins INTEGER, desc TEXT)',
        [],
        () => console.log('Table created successfully'),
        (_, error) => console.error('Error creating table: ', error)
      );
    });
  };

  // Call the createTable function in the component
  useEffect(() => {
    createTable();
  }, []);

  const saveTodoListToStorage = async (list) => {
    try {
      await AsyncStorage.setItem('todoList', JSON.stringify(list));
    } catch (error) {
      console.error('Error saving todoList: ', error);
    }
  };

  const toggleDatePicker = () => {
    setShowDatePicker(!showDatePicker)
  };

  const toggleTimePicker = () => {
    setshowTimePicker(!showTimePicker)
  };

  const onChange = (event, selectedDate) => {
    if (event.type === "set") {
      const currentDate = selectedDate || due;
      const formattedDate = formatDate(currentDate);

      setDue(currentDate); // Set the Date object directly
      if (Platform.OS === "android") {
        toggleDatePicker();
      }
    } else {
      toggleDatePicker();
    }
  };

  const onChangeTime = ({ type, nativeEvent }, selectedTime) => {
    if (type === "set") {
      const formattedTime = selectedTime || time;
      const newFormattedTime = formatTime(formattedTime);
      setTime(new Date(formattedTime));

      if (Platform.OS === "android") {
        toggleTimePicker();
      }
    } else {
      toggleTimePicker();
    }
  };

  const validateMins = (input) => {
    const minsPattern = /^[0-9]*$/;

    if (!minsPattern.test(input) || input < 0 || input > 60) {
      setMinsError('Please enter a valid number between 0 and 60');
    } else {
      setMinsError(null);
      setMins(input);
    }
  };

  const formatDate = (rawDate) => {
    let date = new Date(rawDate)

    let year = date.getFullYear();
    let month = date.getMonth() + 1;
    let day = date.getDate()

    return `${year}-${month < 10 ? '0' : ''}${month}-${day < 10 ? '0' : ''}${day}`;
  }

  const formatTime = (rawTime) => {
    let time = new Date(rawTime);
    let hour = time.getHours();
    let min = time.getMinutes();

    return `${('0' + hour).slice(-2)}:${('0' + min).slice(-2)}`;
  }

  const handleAddTodo = async () => {
    if (todo === "" || minsError) {
      return;
    }
  
    // Combine date and time for the due value
    const combinedDue = new Date(due);
    combinedDue.setHours(time.getHours(), time.getMinutes());
  
    const newTodo = { title: todo, due: combinedDue, desc: desc, mins: mins };

    console.log('add pressed successfully');
  
    try {
      // Insert the newTodo into the SQLite table
      db.transaction((tx) => {
        tx.executeSql(
          'INSERT INTO todos (title, due, mins, desc) VALUES (?, ?, ?, ?)',
          [newTodo.title, newTodo.due, newTodo.mins, newTodo.desc],
          (_, result) => {
            console.log('Todo added successfully');
            console.log('Result:', result);
      
            // Fetch the current todoList from the SQLite table
            tx.executeSql(
              'SELECT * FROM todos',
              [],
              (_, result) => {
                const todos = result.rows.raw();
                console.log('Current todoList:', todos);
                setTodoList(todos);
      
                // Navigate back to TodoScreen
                navigation.navigate('Todo');
              },
              (_, error) => console.error('Error fetching todoList: ', error)
            );
          },
          (_, error) => console.error('Error adding todo: ', error)  // Log any error during insertion
        );
      });      
    } catch (error) {
      console.error('Error adding todo: ', error);
    }
  };
  

  return (
    <View style={styles.container}>
      {/* Add Task Note Container */}
      <LinearGradient colors={['#FC5858', 'pink']} style={styles.noteContainer}>
        <Text style={styles.noteText}>Add Task</Text>
      </LinearGradient>

      {/* New Container */}
      <LinearGradient colors={['#FC5858', 'pink']} style={styles.newContainer}>
        {/* Title */}
        <Text style={styles.subtitle}>Title</Text>
        <TextInput style={styles.input} value={todo} onChangeText={(userText) => setTodo(userText)} />

        {/* Due */}
        <Text style={[styles.subtitle, { marginTop: 10 }]}>Due:</Text>

        {showDatePicker && (
          <DateTimePicker
            mode='date'
            display='calendar'
            value={due} // Use the state value directly
            minimumDate={new Date()}
            onChange={onChange}
            style={styles.datePicker}
          />
        )}

        {!showDatePicker && (
          <Pressable onPress={toggleDatePicker}>
            <TextInput
              style={styles.input}
              value={formatDate(due)}  // Convert the date to string using your formatDate function
              onChangeText={setDue}
              editable={false}
              onPressIn={toggleDatePicker}
            />

          </Pressable>
        )}

        {/* Time */}
        <Text style={[styles.subtitle, { marginTop: 10 }]}>Time:</Text>

        {showTimePicker && (
          <DateTimePicker
            mode='time'
            display='clock'
            value={time} // Use the state value directly
            onChange={onChangeTime}
          />
        )}

        {!showTimePicker && (
          <Pressable onPress={toggleTimePicker}>
            <TextInput
              style={styles.input}
              value={formatTime(time)}  // Convert the time to string using your formatTime function
              onChangeText={setTime}
              onPressIn={toggleTimePicker}
            />
          </Pressable>
        )}

        {/* Minutes */}
        <Text style={styles.subtitle}>Minutes</Text>
        <TextInput
          style={styles.input}
          value={mins.toString()}
          onChangeText={(userText) => {
            validateMins(userText);
          }}
          keyboardType="numeric"
        />
        {minsError && <Text style={styles.errorText}>{minsError}</Text>}

        {/* Task Description */}
        <Text style={[styles.subtitle, { marginTop: 10 }]}>Task Description</Text>
        <TextInput
          style={[styles.input, { height: 100, textAlignVertical: 'top' }]}
          multiline={true}
          value={desc} onChangeText={(userText) => setDesc(userText)}
        />

        {/* Buttons Container */}
        <View style={styles.buttonsContainer}>
          {/* Add Button */}
          <TouchableOpacity style={styles.addButton} onPress={handleAddTodo}>
            <Text style={styles.buttonText}>Add</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>

      {/* Bottom Navigation Container */}
      <View style={{ width: width, position: 'absolute', right: 0, left: 0, bottom: 0, flex: 1 }}>
        <BottomNavigation navigation={navigation} />
      </View>
    </View>
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
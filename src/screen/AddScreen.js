import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Pressable, Platform} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import BottomNavigation from '../navigation/BottomNav';
import DateTimePicker from "@react-native-community/datetimepicker";
import { LinearGradient } from 'expo-linear-gradient';
import {Dimensions} from 'react-native';

const AddScreen = ({ navigation }) => {
  const [todo, setTodo] = useState("");
  const [due, setDue] = useState(new Date());
  const [time, setTime] = useState(new Date());
  const [desc, setDesc] = useState("");
  const [showDatePicker, setshowDatePicker] = useState(false);
  const [showTimePicker, setshowTimePicker] = useState(false);
  const [todoList, setTodoList] = useState([]);
  const {height, width} = Dimensions.get('window');

  useEffect(() => {
    const fetchTodoList = async () => {
      try {
        const storedTodoList = await AsyncStorage.getItem('todoList');
        if (storedTodoList) {
          setTodoList(JSON.parse(storedTodoList));
        }
      } catch (error) {
        console.error('Error fetching todoList: ', error);
      }
    };

    fetchTodoList();
  }, []);

  const saveTodoListToStorage = async (list) => {
    try {
      await AsyncStorage.setItem('todoList', JSON.stringify(list));
    } catch (error) {
      console.error('Error saving todoList: ', error);
    }
  };

  const toggleDatePicker = () =>{
    setshowDatePicker(!showDatePicker)
  };

  const toggleTimePicker = () =>{
    setshowTimePicker(!showTimePicker)
  };

  const onChange = ({ type }, selectedDate) => {
    if (type === "set") {
      const currentDate = selectedDate || due;
      setDue(formatDate(currentDate));
  
      if (Platform.OS === "android") {
        toggleDatePicker();
        setDue(formatDate(currentDate));
      }
    } else {
      toggleDatePicker();
    }
  };
  
  const onChangeTime = ({ type }, selectedTime) => {
    if (type === "set") {
      const time = selectedTime || time;
      setTime(formatTime(time));
  
      if (Platform.OS === "android") {
        toggleTimePicker();
        setTime(formatTime(time));
      }
    } else {
      toggleTimePicker();
    }
  };

  const formatTime = (rawTime) =>{
    let time = new Date(rawTime)

    let hour = time.getHours();
    let min = time.getMinutes();

    return `${hour}:${min}`;
  }

  const formatDate = (rawDate) =>{
    let date = new Date(rawDate)

    let year = date.getFullYear();
    let month = date.getMonth() + 1;
    let day = date.getDate()

    return `${day}/${month}/${year}`;
  }

  const handleAddTodo = async () => {
  if (todo === "") {
    return;
  }

  const newTodo = { id: Date.now().toString(), title: todo, due: due, time: time, desc: desc };

  try {
    // Fetch the current todoList from AsyncStorage
    const storedTodoList = await AsyncStorage.getItem('todoList');
    const currentTodoList = storedTodoList ? JSON.parse(storedTodoList) : [];

    // Add the newTodo to the list
    const updatedTodoList = [...currentTodoList, newTodo];

    // Save the updated todoList to AsyncStorage
    await AsyncStorage.setItem('todoList', JSON.stringify(updatedTodoList));

    // Update the state in the TodoScreen component
    setTodoList(updatedTodoList);

    // Navigate back to TodoScreen
    navigation.navigate('Todo');
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
          value={new Date()}
          onChange={onChange}
          style={styles.datePicker}
        />
        )}

       {!showDatePicker && (
        <Pressable onPress={toggleDatePicker}>
          <TextInput style={styles.input} 
          value={due} 
          onChangeText={setDue}
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
          value={new Date()}
          onChange={onChangeTime}
        />
        )}

       {!showTimePicker && (
        <Pressable onPress={toggleTimePicker}>
          <TextInput style={styles.input} 
          value={time} 
          onChangeText={setTime}
          onPressIn={toggleTimePicker}
           />
       </Pressable>
       )}

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
      <View style={{ width: width, position: 'absolute', right: 0, left: 0, bottom: 0, flex: 1}}>
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
  }
});

export default AddScreen;

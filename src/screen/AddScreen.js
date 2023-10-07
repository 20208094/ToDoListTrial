import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, DatePickerIOS, Pressable, Platform} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import BottomNavigation from '../navigation/BottomNav';
import DateTimePicker from "@react-native-community/datetimepicker";

const AddScreen = ({ navigation }) => {
  const [todo, setTodo] = useState("");
  const [due, setDue] = useState(new Date());
  const [desc, setDesc] = useState("");
  const [showPicker, setShowPicker] = useState(false);
  const [todoList, setTodoList] = useState([]);

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
    setShowPicker(!showPicker)
  };

  const onChange = ({ type }, selectedDate) => {
    if (type === "set") {
      const currentDate = selectedDate || due;
      setDue(currentDate);
  
      if (Platform.OS === "android") {
        toggleDatePicker();
        setDue(currentDate.toDateString());
      }
    } else {
      toggleDatePicker();
    }
  };
  

  const handleAddTodo = async () => {
  if (todo === "") {
    return;
  }

  const newTodo = { id: Date.now().toString(), title: todo, due: due, desc: desc };

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
      <View style={styles.noteContainer}>
        <Text style={styles.noteText}>Add Task</Text>
      </View>

      {/* New Container */}
      <View style={styles.newContainer}>
        {/* Title */}
        <Text style={styles.subtitle}>Title</Text>
        <TextInput style={styles.input} value={todo} onChangeText={(userText) => setTodo(userText)} />

        {/* Due */}
        <Text style={[styles.subtitle, { marginTop: 10 }]}>Due:</Text>
        
        {showPicker && (
          <DateTimePicker 
          mode='date'
          display='spinner'
          value={new Date()}
          onChange={onChange}
          style={styles.datePicker}
        />
        )}

       {!showPicker && (
        <Pressable onPress={toggleDatePicker}>
          <TextInput style={styles.input} 
          value={due} 
          onChangeText={setDue}
          editable={false}
          onPressIn={toggleDatePicker} />
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

          {/* Cancel Button */}
          <TouchableOpacity style={styles.cancelButton} onPress={() => navigation.navigate('Todo')}>
            <Text style={styles.cancelbuttonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Bottom Navigation Container */}
      {/* Assuming BottomNavigation is correctly implemented */}
      <BottomNavigation navigation={navigation} />
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
  datePicker: {
    height: 120,
    marginTop: -10
  }
});

export default AddScreen;
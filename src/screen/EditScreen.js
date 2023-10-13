import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Pressable } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import BottomNavigation from '../navigation/BottomNav';
import DateTimePicker from "@react-native-community/datetimepicker";
import { useRoute } from '@react-navigation/native';

const EditScreen = ({ navigation }) => {
  const [todo, setTodo] = useState("");
  const [due, setDue] = useState(new Date());
  const [desc, setDesc] = useState("");
  const [showPicker, setShowPicker] = useState(false);
  const [todoList, setTodoList] = useState([]);
  const [editedTodo, setEditedTodo] = useState(null);
  // time
  const [time, setTime] = useState(new Date());
  const [showTimePicker, setshowTimePicker] = useState(false);

  const route = useRoute();
  const taskId = route.params?.nestedObject?.id;
  const taskTitle = route.params?.nestedObject?.title;
  const taskDue = route.params?.nestedObject?.due;
  const taskDesc = route.params?.nestedObject?.desc;

  useEffect(() => {
    if (taskId !== undefined && taskTitle !== undefined && taskDue !== undefined && taskDesc !== undefined) {
      setTodo(taskTitle);
      setDue(taskDue)
      setDesc(taskDesc);
      setTime(new Date(taskDue));
      setEditedTodo({ id: taskId, title: taskTitle, due: taskDue, desc: taskDesc });
    }
  }, [taskId, taskTitle, taskDue, taskDesc]);


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

  const toggleDatePicker = () => {
    setShowPicker(!showPicker)
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

  const formatDate = (rawDate) => {
    let date = new Date(rawDate)

    let year = date.getFullYear();
    let month = date.getMonth() + 1;
    let day = date.getDate()

    return `${day}/${month}/${year}`;
  }

  const formatTime = (rawTime) => {
    let time = new Date(rawTime);
    let hour = time.getHours();
    let min = time.getMinutes();

    return `${('0' + hour).slice(-2)}:${('0' + min).slice(-2)}`;
  }

  const saveTodoListToStorage = async (list) => {
    try {
      await AsyncStorage.setItem('todoList', JSON.stringify(list));
    } catch (error) {
      console.error('Error saving todoList: ', error);
    }
  };

  const handleUpdateTodo = () => {
    if (editedTodo === null || todo === "") {
      return;
    }
  
    // Combine date and time for the due value
    const updatedDue = new Date(due);
    updatedDue.setHours(time.getHours(), time.getMinutes());
  
    const updatedTodos = todoList.map((item) => {
      if (item.id === editedTodo.id) {
        return { ...item, title: todo, due: updatedDue, desc: desc };
      }
      return item;
    });
  
    setTodoList(updatedTodos);
    saveTodoListToStorage(updatedTodos);
    navigation.goBack();
  };
  

  const handleCancel = () => {
    // Navigate back to the previous screen
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <View style={styles.noteContainer}>
        <Text style={styles.noteText}>Edit Task</Text>
      </View>

      <View style={styles.newContainer}>
        <Text style={styles.subtitle}>Title</Text>
        <TextInput style={styles.input} value={todo} onChangeText={(userText) => setTodo(userText)} />

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
              value={formatDate(due)}
              onChangeText={setDue}
              editable={false}
              onPressIn={toggleDatePicker} />
          </Pressable>
        )}

        {/* Time */}
        <Text style={[styles.subtitle, { marginTop: 10 }]}>Time:</Text>

        {showTimePicker && (
          <DateTimePicker
            mode='time'
            display='clock'
            value={time}
            onChange={onChangeTime}
          />
        )}

        {!showTimePicker && (
          <Pressable onPress={toggleTimePicker}>
            <TextInput
              style={styles.input}
              value={formatTime(time)}
              onChangeText={setTime}
              onPressIn={toggleTimePicker}
            />
          </Pressable>
        )}

        <Text style={[styles.subtitle, { marginTop: 10 }]}>Task Description</Text>
        <TextInput
          style={[styles.input, { height: 100, textAlignVertical: 'top' }]}
          multiline={true}
          value={desc} onChangeText={(userText) => setDesc(userText)}
        />

        <View style={styles.buttonsContainer}>
          <TouchableOpacity style={styles.addButton} onPress={() => handleUpdateTodo()}>
            <Text style={styles.buttonText}>Edit</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.cancelButton} onPress={() => handleCancel()}>
            <Text style={styles.cancelbuttonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>

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
});

export default EditScreen;
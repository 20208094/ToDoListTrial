import React, { useState, useEffect, useCallback } from 'react';
import { FlatList, StyleSheet, Text, View, Modal, Pressable, Image, TouchableOpacity, Button, Dimensions } from 'react-native';
import { IconButton, Checkbox } from 'react-native-paper';
import Fallback from "../../components/Fallback";
import AsyncStorage from '@react-native-async-storage/async-storage';
import BottomNavigation from '../../navigation/BottomNav';
import { useIsFocused } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import Dialog from "react-native-dialog";
import * as Notifications from 'expo-notifications';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

const TodoScreen = ({ navigation }) => {
  const [todo, setTodo] = useState("");
  const [todoList, setTodoList] = useState([]);
  const [deleteConfirmTodo, setDeleteConfirmTodo] = useState(null);
  const [checkedItems, setCheckedItems] = useState({});
  const [modalDeleteVisible, setModalDeleteVisible] = useState(false);
  const { height, width } = Dimensions.get('window');

  const isFocused = useIsFocused();

  // Load the todoList and checkedItems from AsyncStorage when the component mounts or when the screen is focused
  const fetchTodoList = useCallback(async () => {
    try {
      const storedTodoList = await AsyncStorage.getItem('todoList');
      const storedCheckedItems = await AsyncStorage.getItem('checkedItems');

      if (storedTodoList) {
        const parsedTodoList = JSON.parse(storedTodoList);
        setTodoList(parsedTodoList);
      }

      if (storedCheckedItems) {
        const parsedCheckedItems = JSON.parse(storedCheckedItems);
        setCheckedItems(parsedCheckedItems);
      }
    } catch (error) {
      console.error('Error loading data: ', error);
    }
  }, []);

  useEffect(() => {
    fetchTodoList();
  }, [isFocused, fetchTodoList]);

  useEffect(() => {
    const checkDueNotifications = async () => {
      try {
        const notificationsToSchedule = [];

        // Check for each item in the todoList
        todoList.forEach((item) => {

          const dueDate = new Date(item.due).getDate();
          const currentDate = new Date().getDate();
          const currentTime = new Date().getTime();
          const dueTime = new Date(item.due).getTime();
          const notificationMinutes = item.mins; // Get the notification minutes from the item

          // const notifTime = new Date(dueTime - notificationMinutes * 60 * 1000).getTime();

            // if (currentDate == dueDate) {
            //     notificationsToSchedule.push(scheduleDateNotification(item, currentDate));
            // }

            // if (notifTime <= currentTime) {
            //     notificationsToSchedule.push(scheduleTimeNotification(item, notifTime));
            // }

            if (dueTime - currentTime > 0 && dueTime - currentTime <= item.notifTime * 60 * 1000) {
              // Schedule a notification for this item within the next 5 minutes
              console.log('Scheduling notification for:', item);
              notificationsToSchedule.push(scheduleNotification(item));
            } else if (dueTime <= currentTime) {
              // Schedule a notification for this item with a past due time
              console.log('Scheduling past due notification for:', item);
              notificationsToSchedule.push(schedulePastDueNotification(item));
            }
            
        });

        // Wait for all notifications to be scheduled before continuing
        await Promise.all(notificationsToSchedule);
      } catch (error) {
        console.error('Error scheduling notifications: ', error);
      }
    };

    // Call the checkDueNotifications function
    checkDueNotifications();
  }, [todoList]);


  useEffect(() => {
    const requestNotificationPermissions = async () => {
      try {
        const { status } = await Notifications.requestPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert('Permission to receive notifications was denied');
        }
      } catch (error) {
        console.error('Error requesting notification permissions: ', error);
      }
    };

    requestNotificationPermissions();
  }, [])

  const saveTodoListToStorage = async (list) => {
    try {
      await AsyncStorage.setItem('todoList', JSON.stringify(list));
    } catch (error) {
      console.error('Error saving todoList: ', error);
    }
  };

  const schedulePastDueNotification = async (item) => {
    try {   
      await Notifications.scheduleNotificationAsync({
        content: {
            title: 'Task Reminder',
            body: `Your task "${item.title}" is past its due!`,
          },
          trigger: null
        });

    } catch (error) {
      console.error('Error scheduling notification:', error);
    }
  };
  
  const scheduleNotification = async (item) => {
    try {
        await Notifications.scheduleNotificationAsync({
            content: {
                title: 'Task Reminder',
                body: `Your task "${item.title}" is in "${item.notifTime}" minutes.!`,
                },
                trigger: null
            });

    } catch (error) {
        console.error('Error scheduling notification:', error);
    }
  };
  

  const saveCheckedItemsToStorage = async (items) => {
    try {
      await AsyncStorage.setItem('checkedItems', JSON.stringify(items));
    } catch (error) {
      console.error('Error saving checkedItems: ', error);
    }
  };

  const handleDeleteConfirmTodo = (todo) => {
    setDeleteConfirmTodo(todo);
    setModalDeleteVisible(true);
  };

  const handleDeleteTodo = () => {
    const idToDelete = deleteConfirmTodo.id;
    const updatedTodoList = todoList.filter((todo) => todo.id !== idToDelete);
    setTodoList(updatedTodoList);
    saveTodoListToStorage(updatedTodoList);

    // Remove the checked status for the deleted item
    const updatedCheckedItems = { ...checkedItems };
    delete updatedCheckedItems[idToDelete];
    setCheckedItems(updatedCheckedItems);
    saveCheckedItemsToStorage(updatedCheckedItems);

    setModalDeleteVisible(false);
  };

  const handleEditPress = (item) => {
    navigation.navigate('Edit', { nestedObject: { id: item.id, title: item.title, due: item.due, desc: item.desc } });
  };

  const formatTime = (rawTime) => {
    let time = new Date(rawTime);
    let hour = time.getHours();
    let min = time.getMinutes();

    return `${('0' + hour).slice(-2)}:${('0' + min).slice(-2)}`;
  }

  const formatDate = (rawDate) => {
    let date = new Date(rawDate)

    let year = date.getFullYear();
    let month = date.getMonth() + 1;
    let day = date.getDate()

    return `${year}-${month < 10 ? '0' : ''}${month}-${day < 10 ? '0' : ''}${day}`;
  }

  const [selectedTodo, setSelectedTodo] = useState(null);

  const renderTodos = ({ item, index }) => {
    // Check if the item is unchecked
    if (!checkedItems[item.id]) {
      return (
        <View style={{ backgroundColor: 'white', borderRadius: 4, width: '100%', height: 75, justifyContent: 'center', marginBottom: 10 }}>
          <View style={{ flexDirection: 'row' }}>
            <Checkbox
              status={checkedItems[item.id] ? 'checked' : 'unchecked'}
              onPress={() => {
                const newCheckedItems = { ...checkedItems };
                newCheckedItems[item.id] = !checkedItems[item.id];
                setCheckedItems(newCheckedItems);
                saveCheckedItemsToStorage(newCheckedItems);
              }}
              style={{ paddingHorizontal: 5 }} />
            <View style={{ flex: 1 }} >
              <Text style={{ color: 'black', fontSize: 25, fontWeight: '800' }} numberOfLines={1} ellipsizeMode="tail">{item.title}</Text>
              <Text style={{ color: 'gray', fontSize: 15 }}>
                {formatDate(new Date(item.due))}
                {'      '}
                {formatTime(new Date(item.due))}
              </Text>
            </View>

            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <IconButton style={{ margin: 0 }} icon="eye" iconColor='#3498db' onPress={() => showDialog(item)} />
              {/* Popup dialog */}
              <Dialog.Container visible={visible}>
                <Dialog.Title>{selectedTodo?.title}</Dialog.Title>
                <Dialog.Description>
                  {selectedTodo?.desc}
                </Dialog.Description>
                <Text>{formatDate(new Date(selectedTodo?.due))}</Text>
                <Text>{formatTime(new Date(selectedTodo?.due))}</Text>
                <Text>{selectedTodo?.notifTime}</Text>
                <Dialog.Button label="Done" onPress={handleCancel} />
              </Dialog.Container>
              <IconButton style={{ margin: 0 }} icon="pencil" iconColor='#f39c12' onPress={() => handleEditPress(item)} />
              <IconButton style={{ margin: 0 }} icon="trash-can" iconColor='#e74c3c' onPress={() => handleDeleteConfirmTodo(item)} />
            </View>
          </View>

          {/* <View>
          <Text style={{ color: 'gray', fontSize: 12,  marginLeft: 37,  }}>
            {formatDate(new Date(item.due))}
            {'      '}
            {formatTime(new Date(item.due))}
          </Text>
        </View>  */}

        </View>
      );
    } else {
      return null; // Don't render checked tasks
    }
  };


  const taskCon = height / 1.5;
  const [visible, setVisible] = useState(false);

  const showDialog = (item) => {
    setSelectedTodo(item);
    setVisible(true);
  };

  const handleCancel = () => {
    setSelectedTodo(null);
    setVisible(false);
  };

  //Get the total number of current unfinished task
  const uncheckedItemsCount = Object.values(checkedItems).filter(isChecked => !isChecked).length;

  return (
    <>
      <View style={{ marginHorizontal: 16, marginTop: 200, fontSize: 20 }}>

        <View style={{ flexDirection: 'row', borderColor: '#FC5858', backgroundColor: '#dbdbdb', borderWidth: 5, marginStart: -30, paddingStart: 40, alignItems: 'center', borderTopRightRadius: 50, borderBottomRightRadius: 50, justifyContent: 'flex-end', width: width - 170, marginTop: -150 }}>
          <Text style={{ fontSize: 15, fontWeight: 'bold' }}>Assigment Application</Text>
          <Image
            source={require("../../assets/splash.png")}
            style={{ height: 60, width: 60, marginBottom: 5, marginEnd: 10 }}
          />
        </View>
        <View>
          <Text style={{ fontSize: 35, textAlign: 'center', fontWeight: 'bold', marginBottom: 10, marginTop: 15 }}>
            TASKS
          </Text>

          {/* Display the total of unfinished task */}
          <View style={{ backgroundColor: 'pink', width: 145, height: 20, borderRadius: 5, borderColor: '#FC5858', borderWidth: 1 }}>
            <Text style={{ fontWeight: 'bold', fontSize: 16, marginHorizontal: 5 }}>Unfinished Tasks: {uncheckedItemsCount}</Text>
          </View>
        </View>
        <LinearGradient colors={['#FC5858', 'pink']} style={{ borderTopRightRadius: 40, borderBottomLeftRadius: 40, height: height / 1.5, marginTop: 5, padding: 20, fontSize: 20 }}>
          <View style={{ backgroundColor: '#dbdbdb', padding: 10, height: taskCon - 50, borderRadius: 6, borderColor: '#fff', borderWidth: 5 }}>
            {todoList.length <= 0 && <Fallback />}

            {/* RENDER TO DO LIST */}
            <FlatList data={todoList} renderItem={renderTodos} />
          </View>
        </LinearGradient>

        {/* Add Button */}
        <Pressable style={{ position: 'absolute', bottom: 1, right: 1, }} onPress={() => navigation.navigate('Add')}>
          <View style={{
            backgroundColor: '#FC5858',
            width: 80,
            height: 80,
            borderRadius: 80,
            alignItems: 'center',
            justifyContent: 'center',
            borderWidth: 7,
            borderColor: 'white',
            bottom: 8,
            right: 8,
          }}>
            <Text style={{ fontSize: 50, color: 'white', }}>+</Text>
          </View>
        </Pressable>

        {/* DELETE MODAL */}
        <Modal
          transparent={true}
          visible={modalDeleteVisible}
          onRequestClose={() => {
            Alert.alert('Modal has been closed.');
            setModalDeleteVisible(!modalDeleteVisible);
          }}>
          <View style={{ justifyContent: 'center', alignItems: 'center' }}>
            <View style={{
              margin: 10,
              marginTop: 290,
              width: 330,
              height: 220,
              backgroundColor: 'white',
              padding: 35,
              alignItems: 'center',
              elevation: 10,
              fontSize: 20,
              borderColor: '#FC5858',
              borderTopRightRadius: 50,
              borderBottomLeftRadius: 50,
              borderWidth: 5
            }}>
              <Text style={{ fontSize: 20, backgroundColor: 'white', fontWeight: 'bold', padding: 5, width: 300, textAlign: 'center', borderRadius: 20, marginTop: 20, borderColor: '#FC5858', borderWidth: 3, marginBottom: 25 }}>Do you really want to delete this task?</Text>

              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignContent: 'center', overflow: 'hidden', paddingStart: 30 }}>
                <Pressable style={{ backgroundColor: '#FB3854', width: '60%', height: 40, justifyContent: 'center', alignItems: 'center', borderRadius: 30, zIndex: 1 }} onPress={() => handleDeleteTodo()}>
                  <Text style={{ color: 'white', fontWeight: 'bold' }}>Delete</Text>
                </Pressable>

                <Pressable style={{ backgroundColor: 'white', width: '60%', height: 40, justifyContent: 'center', alignItems: 'center', borderRadius: 30, position: 'relative', left: -30, borderColor: '#FB3854', borderWidth: 2 }} onPress={() => setModalDeleteVisible(!modalDeleteVisible)}>
                  <Text style={{ color: '#FC5858', fontWeight: 'bold' }}>Cancel</Text>
                </Pressable>
              </View>
            </View>
          </View>
        </Modal>


      </View>



      {/* Bottom Navigation Container */}
      <View style={{ width: width, position: 'absolute', right: 0, left: 0, bottom: 0, flex: 1 }}>
        <BottomNavigation navigation={navigation} />
      </View>
    </>
  )
}

const styles = StyleSheet.create({
});

export default TodoScreen
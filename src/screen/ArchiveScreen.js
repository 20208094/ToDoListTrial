import React, { useState, useEffect, useCallback } from 'react';
import { FlatList, StyleSheet, Text, View, Modal, Pressable, Image } from 'react-native';
import { IconButton, Checkbox } from 'react-native-paper';
import Fallback2 from "../components/Fallback2";
import AsyncStorage from '@react-native-async-storage/async-storage';
import BottomNavigation from '../navigation/BottomNav';
import { useIsFocused } from '@react-navigation/native';
import Dialog from "react-native-dialog";
import { LinearGradient } from 'expo-linear-gradient';
import { SwipeListView } from 'react-native-swipe-list-view';

const ArchiveScreen = ({ navigation }) => {
    const [todo, setTodo] = useState("");
    const [todoList, setTodoList] = useState([]);
    const [deleteConfirmTodo, setDeleteConfirmTodo] = useState(null);
    const [checkedItems, setCheckedItems] = useState({});
    const [modalDeleteVisible, setModalDeleteVisible] = useState(false);

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

    const saveTodoListToStorage = async (list) => {
        try {
            await AsyncStorage.setItem('todoList', JSON.stringify(list));
        } catch (error) {
            console.error('Error saving todoList: ', error);
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

    const formatDate = (rawDate) =>{
        let date = new Date(rawDate)
    
        let year = date.getFullYear();
        let month = date.getMonth() + 1;
        let day = date.getDate()
    
        return `${year}-${month < 10 ? '0' : ''}${month}-${day < 10 ? '0' : ''}${day}`;
    }

    const [selectedTodo, setSelectedTodo] = useState(null);
    const [visible, setVisible] = useState(false);

    const showDialog = (item) => {
        setSelectedTodo(item);
        setVisible(true);
    };
    
    const handleCancel = () => {
        setSelectedTodo(null);
        setVisible(false);
    };

    const renderTodos = ({ item, index }) => {
        // Check if the item is unchecked
        if (checkedItems[item.id]) {
            return (
                <View style={{marginBottom: 10}}>
                    <SwipeListView
                    data={[item]} 
                    renderItem={(data, rowMap) => (
                        <View style={{ backgroundColor: 'lightgreen', borderRadius: 4, width: '100%', height: 75, justifyContent: 'center' }}>
                            <View style={{ flexDirection: 'row' }}>
                                <Checkbox 
                                    status={checkedItems[data.item.id] ? 'checked' : 'unchecked'} 
                                    onPress={() => { 
                                        const newCheckedItems = { ...checkedItems }; 
                                        newCheckedItems[data.item.id] = !checkedItems[data.item.id]; 
                                        setCheckedItems(newCheckedItems); 
                                        saveCheckedItemsToStorage(newCheckedItems); 
                                    }}
                                    style={{ paddingHorizontal: 5}}
                                />
                                <View style={{flex: 1}} >
                                    <Text style={{color: 'black', fontSize: 25, fontWeight: '800'}} numberOfLines={1} ellipsizeMode="tail">{data.item.title}</Text>
                                    <Text style={{ color: 'gray', fontSize: 15 }}>DUE: {formatDate(new Date(item.due))} {formatTime(new Date(item.due))}</Text>
                                </View>
                                <View style={{ flexDirection: 'row', alignItems: 'center'}}>
                                    <IconButton style={{ margin: 0 }} icon="eye" iconColor='#3498db' onPress={() => showDialog(data.item)} />
                                        {/* Popup dialog */}
                                        <Dialog.Container visible={visible}>
                                            <Dialog.Title>{selectedTodo?.title}</Dialog.Title>
                                            <Dialog.Description>
                                                {selectedTodo?.desc}
                                            </Dialog.Description>
                                            <Text>DUE: {selectedTodo?.formattedDate}</Text>
                                            <Dialog.Button label="Done" onPress={handleCancel} />
                                        </Dialog.Container>
                                </View>
                            </View>
                        </View>
                    )}
                    renderHiddenItem={(data, rowMap) => (
                        <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', backgroundColor: 'gray', height: 75, width: '100%', position: 'absolute', right: 0, borderRadius: 4}}>
                            <Pressable style={{backgroundColor: '#e74c3c', width: 60, height: '100%', alignItems: 'center', justifyContent: 'center', borderTopEndRadius: 4, borderBottomEndRadius: 4}} onPress={() => handleDeleteConfirmTodo(data.item)}>
                                <IconButton style={{ margin: 0, backgroundColor: '#e74c3c' }} icon="trash-can" iconColor='black'  />
                            </Pressable>
                        </View>
                    )}
                    rightOpenValue={-60}
                    />
                </View>
                    );
                } else {
                    return null; // Don't render checked tasks
        }
    };
  
    return (
        <>
        <View style={{ marginHorizontal: 16, marginVertical: 200, fontSize: 20}}>
            <View>
                <Text style={{ fontSize: 35, textAlign: 'center', fontWeight: 'bold', marginBottom: 10, marginTop: 15 }}>
                    ARCHIVES
                </Text>
            </View>
            <LinearGradient colors={['#FC5858', 'pink']} style={{ borderTopRightRadius: 40, borderBottomLeftRadius: 40, height: 500, marginTop: 5, padding: 20, fontSize: 20 }}>

                <View style={{ backgroundColor: '#dbdbdb', padding: 10, height: 450, borderRadius: 6, borderColor: '#fff', borderWidth: 5 }}>
                    {todoList.length <= 0 && <Fallback2 />}

                    {/* RENDER TO DO LIST */}
                    <FlatList data={todoList} renderItem={renderTodos} />

                </View>
            </LinearGradient>

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
        <BottomNavigation navigation={navigation} />
    </>
    )
}

const styles = StyleSheet.create({
});

export default ArchiveScreen



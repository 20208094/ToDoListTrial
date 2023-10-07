import React, { useState, useEffect, useCallback } from 'react';
import { FlatList, StyleSheet, Text, View, Modal, Pressable, Image } from 'react-native';
import { IconButton, Checkbox } from 'react-native-paper';
import Fallback2 from "../components/Fallback2";
import AsyncStorage from '@react-native-async-storage/async-storage';
import BottomNavigation from '../navigation/BottomNav';
import { useIsFocused } from '@react-navigation/native';

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

    const renderTodos = ({ item, index }) => {
        // Check if the item is unchecked
        if (checkedItems[item.id]) {
            return (
                <View style={{ backgroundColor: "lightgreen", borderRadius: 6, paddingTop: 15, marginBottom: 12}} numberOfLines={1} ellipsizeMode="tail">
                    <View>
                        <Text style={{ color: 'black', fontSize: 15, fontWeight: '800', flex: 1, marginLeft: 10, marginTop: -10, marginBottom: -20}}>{item.title}</Text>
                    </View>
                    <View style={{flexDirection: 'row', alignItems: "center"}}>
                        <Checkbox
                            status={checkedItems[item.id] ? 'checked' : 'unchecked'}
                            onPress={() => {
                                const newCheckedItems = { ...checkedItems };
                                newCheckedItems[item.id] = !checkedItems[item.id];
                                setCheckedItems(newCheckedItems);
                                saveCheckedItemsToStorage(newCheckedItems);
                            }}
                        />
                        <Text style={{ color: 'black', fontSize: 12, fontWeight: '800', flex: 1}} numberOfLines={2} ellipsizeMode="tail">{item.desc}</Text>
                        <IconButton style={{marginLeft: 1}} icon="trash-can" iconColor='red' onPress={() => handleDeleteConfirmTodo(item)} />
                    </View>
                    <View>
                        <Text style={{ color: 'gray', fontSize: 8, flex: 1, marginLeft: 37, marginTop: -10, marginBottom: 2}}>{item.due}</Text>
                    </View>
                </View>
            );
        } else {
            return null; // Don't render checked tasks
        }
    };
  

    return (
        <>
        <View style={{ marginHorizontal: 16, marginTop: 200, fontSize: 20}}>
            <View style={{flexDirection: 'row', borderColor: '#FC5858', backgroundColor: '#dbdbdb', borderWidth: 5, marginStart: -30, paddingStart: 40, alignItems: 'center', borderTopRightRadius: 50, borderBottomRightRadius: 50, justifyContent: 'flex-end', width: 250, marginTop: -150}}>
                <Text style={{fontSize: 15, fontWeight: 'bold'}}>Assigment Application</Text>
                <Image
                    source={require("../../assets/splash.png")}
                    style={{ height: 60, width: 60, marginBottom: 5, marginEnd: 10}}
                />
            </View>
            <View>
                <Text style={{ fontSize: 35, textAlign: 'center', fontWeight: 'bold', marginBottom: 10, marginTop: 15 }}>
                    ARCHIVES
                </Text>
            </View>
            <View style={{ backgroundColor: '#FC5858', borderTopRightRadius: 40, borderBottomLeftRadius: 40, height: 500, marginTop: 5, padding: 20, fontSize: 20 }}>

                <View style={{ backgroundColor: '#dbdbdb', padding: 10, height: 450, borderRadius: 6, borderColor: '#fff', borderWidth: 5 }}>
                    {todoList.length <= 0 && <Fallback2 />}

                    {/* RENDER TO DO LIST */}
                    <FlatList data={todoList} renderItem={renderTodos} />
                </View>
            </View>

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



import React, { useState, useEffect } from 'react';
import { FlatList, StyleSheet, Text, TextInput, Touchable, TouchableOpacity, View, Modal, Pressable, Image } from 'react-native';
import { IconButton, Checkbox } from 'react-native-paper';
import Fallback from "../components/Fallback";
import AsyncStorage from '@react-native-async-storage/async-storage';

const TodoScreen = () => {
    // Init Local States
    const [todo, setTodo] = useState("");
    const [todoList, setTodoList] = useState([])
    const [editedTodo, setEditedTodo] = useState(null);
    const [deleteConfirmTodo, setDeleteConfirmTodo] = useState(null);
    const [checkedItems, setCheckedItems] = React.useState({});
    const [modalAddVisible, setModalAddVisible] = useState(false);
    const [modalEditVisible, setModalEditVisible] = useState(false);
    const [modalDeleteVisible, setModalDeleteVisible] = useState(false);

    // Load the todoList from AsyncStorage when the component mounts
    useEffect(() => {
        AsyncStorage.getItem('todoList')
            .then((storedTodoList) => {
                if (storedTodoList) {
                    const parsedTodoList = JSON.parse(storedTodoList);
                    setTodoList(parsedTodoList);
                }
            })
            .catch((error) => {
                console.error('Error loading todoList: ', error);
            });
    }, []); // Empty dependency array means this effect runs once when the component mounts

        // Load the checkedItems from AsyncStorage when the component mounts
        useEffect(() => {
            AsyncStorage.getItem('checkedItems')
                .then((storedCheckedItems) => {
                    if (storedCheckedItems) {
                        const parsedCheckedItems = JSON.parse(storedCheckedItems);
                        setCheckedItems(parsedCheckedItems);
                    }
                })
                .catch((error) => {
                    console.error('Error loading checkedItems: ', error);
                });
        }, []);

    // Function to save the todoList to AsyncStorage
    const saveTodoListToStorage = async (list) => {
        try {
            await AsyncStorage.setItem('todoList', JSON.stringify(list));
        } catch (error) {
            console.error('Error saving todoList: ', error);
        }
    };

    // Function to save the checkedItems to AsyncStorage
    const saveCheckedItemsToStorage = async (items) => {
        try {
            await AsyncStorage.setItem('checkedItems', JSON.stringify(items));
        } catch (error) {
            console.error('Error saving checkedItems: ', error);
        }
    };

    // Handle Add Todo
    const handleAddTodo = () => {
        if (todo === "") {
            return;
        }
        const newTodo = { id: Date.now().toString(), title: todo };
        setTodoList([...todoList, newTodo]);
        setTodo("");
        saveTodoListToStorage([...todoList, newTodo]); // Save the updated list

        // Close the modal after adding a todo item
        setModalAddVisible(false)
    };

    // Handle Delete confirmation Todo
    const handleDeleteConfirmTodo = (todo) => {
        setDeleteConfirmTodo(todo);
        setTodo(todo.id);
        // Now, you can perform any additional actions related to editing 'item' here.
        // For example, you can open a modal for editing.
        setModalDeleteVisible(true);
    }

    // Handle Delete Todo
    const handleDeleteTodo = (id) => {
        const updatedTodoList = todoList.filter((todo) => todo.id !== id);
        setTodoList(updatedTodoList);
        saveTodoListToStorage(updatedTodoList); // Save the updated list
        // Close the modal after deleting a todo item
        setModalDeleteVisible(false)
    }

    // Handle Edit Todo
    const handleEditTodo = (todo) => {
        setEditedTodo(todo);
        setTodo(todo.title);
        // Now, you can perform any additional actions related to editing 'item' here.
        // For example, you can open a modal for editing.
        setModalEditVisible(true);
    }

    // Handle Update Todo
    const handleUpdateTodo = () => {
        
        if (todo === "") {
            return;
        }
        const updatedTodos = todoList.map((item) => {
            if (item.id === editedTodo.id) {
                return { ...item, title: todo };
            }
            return item;
        });
        setTodoList(updatedTodos);
        setEditedTodo(null);
        setTodo("");
        saveTodoListToStorage(updatedTodos); // Save the updated list

        // Close the modal after editing a todo item
        setModalEditVisible(false)
    }

    //render todo
    const renderTodos = ({ item, index }) => {
        return (
            <View style={{ backgroundColor: "white", borderRadius: 6, paddingHorizontal: 6, paddingVertical: 6, marginBottom: 12, flexDirection: 'row', alignItems: "center", paddingLeft: 15 }}>
                <Checkbox
                        status={checkedItems[item.id] ? 'checked' : 'unchecked'}
                        onPress={() => {
                            const newCheckedItems = { ...checkedItems };
                            newCheckedItems[item.id] = !checkedItems[item.id];
                            setCheckedItems(newCheckedItems);
                            saveCheckedItemsToStorage(newCheckedItems); // Save the updated checkedItems
                        }}
                />
                <Text style={{ color: 'black', fontSize: 20, fontWeight: '800', flex: 1, marginHorizontal: 10 }} numberOfLines={2} ellipsizeMode="tail">{item.title}</Text>



                <IconButton icon="pencil" iconColor='darkblue' onPress={() => handleEditTodo(item)} />
                {/* <IconButton icon="trash-can" iconColor='red' onPress={() => handleDeleteTodo(item.id)} /> */}
                <IconButton icon="trash-can" iconColor='red' onPress={() => handleDeleteConfirmTodo(item)} />
            </View>
        )
    }

    const renderChecked = ({ item, index }) => {
        return (
            <View style={{ backgroundColor: "white", borderRadius: 6, paddingHorizontal: 6, paddingVertical: 6, marginBottom: 12, flexDirection: 'row', alignItems: "center", paddingLeft: 15, marginTop:12 }}>
                <Checkbox
                        status={checkedItems[item.id] ? 'checked' : 'unchecked'}
                        onPress={() => {
                            const newCheckedItems = { ...checkedItems };
                            newCheckedItems[item.id] = !checkedItems[item.id];
                            setCheckedItems(newCheckedItems);
                            saveCheckedItemsToStorage(newCheckedItems); // Save the updated checkedItems
                        }}
                />
                <Text style={{ color: 'black', fontSize: 20, fontWeight: '800', flex: 1, marginHorizontal: 10 }} numberOfLines={2} ellipsizeMode="tail">{item.title}</Text>

                <IconButton icon="pencil" iconColor='darkblue' onPress={() => handleEditTodo(item)} />
                {/* <IconButton icon="trash-can" iconColor='red' onPress={() => handleDeleteTodo(item.id)} /> */}
                <IconButton icon="trash-can" iconColor='red' onPress={() => handleDeleteConfirmTodo(item)} />
            </View>
        )
    }

    return (
        <View style={{ marginHorizontal: 16, marginTop: 200, fontSize: 20}}>
            <View style={{flexDirection: 'row', borderColor: '#FC5858', backgroundColor: '#dbdbdb', borderWidth: 8, marginStart: -30, paddingStart: 40, alignItems: 'center', borderTopRightRadius: 50, borderBottomRightRadius: 50, justifyContent: 'center', width: 340, marginTop: -150}}>
                <Text style={{fontSize: 30, fontWeight: 'bold'}}>Assigment App</Text>
                <Image
                    source={require("../../assets/splash.png")}
                    style={{ height: 80, width: 80, marginBottom: 10, marginEnd: 20}}
                />
            </View>
            <View>
                <Text style={{ fontSize: 50, textAlign: 'center', fontWeight: 'bold', marginBottom: 10, marginTop: 15 }}>
                    Tasks
                </Text>
            </View>
            <View style={{ backgroundColor: '#FC5858', borderTopRightRadius: 40, borderBottomLeftRadius: 40, height: 500, marginTop: 5, padding: 20, fontSize: 20}}>

                <View style={{ backgroundColor: '#dbdbdb', padding: 10, height: 450, borderRadius: 6, borderColor: '#fff', borderWidth: 5 }}>
                    {todoList.length <= 0 && <Fallback />}

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
                            margin: 20,
                            marginTop: 310,
                            width: 390,
                            height: 270,
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
                            <Text style={{fontSize: 30, backgroundColor:'white', fontWeight:'bold', padding:5, width:300, textAlign:'center', borderRadius: 20, marginTop:20, borderColor: '#FC5858', borderWidth:3, marginBottom:25}}>Do you really want to delete this task?</Text>
                            
                            <View style={{flexDirection: 'row', justifyContent: 'space-between', alignContent: 'center', overflow: 'hidden', paddingStart:30}}>
                                <Pressable style={{backgroundColor: '#FB3854',width: '60%',height: 40,justifyContent: 'center',alignItems: 'center',borderRadius: 30,zIndex: 1}} onPress={() => handleDeleteTodo(todo)}>
                                <Text style={{color: 'white', fontWeight: 'bold'}}>Delete</Text>
                                </Pressable>

                                <Pressable style={{backgroundColor: 'white',width: '60%',height: 40,justifyContent: 'center',alignItems: 'center',borderRadius: 30, position: 'relative',left: -30, borderColor:'#FB3854', borderWidth:2}} onPress={() => setModalDeleteVisible(!modalDeleteVisible)}>
                                <Text style={{color: '#FC5858', fontWeight: 'bold'}}>Cancel</Text>
                                </Pressable>
                            </View> 
                        </View>
                    </View>
                </Modal>
            <View>
                {/* ADD MODAL */}
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={modalAddVisible}
                    onRequestClose={() => {
                        Alert.alert('Modal has been closed.');
                        setModalAddVisible(!modalAddVisible);
                    }}>
                    <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                        <View style={{
                            margin: 20,
                            marginTop: 170,
                            width: 390,
                            height: 470,
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
                            <Text style={{fontSize: 40, backgroundColor:'#FC5858', fontWeight:'bold', padding:5, width:230, textAlign:'center', borderRadius: 20, marginTop:20}}>Add Task</Text>

                            <View style={{backgroundColor:'#FC5858', padding:10, paddingTop:20, margin:10, marginTop:30, borderRadius: 20,marginBottom:30}}>

                                <Text style={{fontSize:30, marginBottom:10, marginStart:10}}>Title:</Text>

                                <TextInput style={{ borderWidth: 2, borderColor: "white", borderRadius: 20, paddingVertical: 6, paddingHorizontal: 16, width: 250, height: 100, color: "black", backgroundColor: 'white', fontSize: 18, marginStart:10, marginEnd:10, marginBottom:20}}
                                    placeholder='Task Title'
                                    value={todo}
                                    multiline
                                    onChangeText={(userText) => setTodo(userText)}
                                />

                                 
                            </View>
                            <View style={{flexDirection: 'row', justifyContent: 'space-between', alignContent: 'center', overflow: 'hidden', paddingStart:30}}>
                                <Pressable style={{backgroundColor: '#FB3854',width: '60%',height: 40,justifyContent: 'center',alignItems: 'center',borderRadius: 30,zIndex: 1}} onPress={() => handleAddTodo()}>
                                <Text style={{color: 'white', fontWeight: 'bold'}}>Add</Text>
                                </Pressable>

                                <Pressable style={{backgroundColor: 'white',width: '60%',height: 40,justifyContent: 'center',alignItems: 'center',borderRadius: 30, position: 'relative',left: -30, borderColor:'#FB3854', borderWidth:2}} onPress={() => setModalAddVisible(!modalAddVisible)}>
                                <Text style={{color: '#FC5858', fontWeight: 'bold'}}>Cancel</Text>
                                </Pressable>
                            </View> 
                        </View>
                    </View>
                </Modal>
                {/* EDIT MODAL */}
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={modalEditVisible}
                    onRequestClose={() => {
                        Alert.alert('Modal has been closed.');
                        setModalEditVisible(!modalEditVisible);
                    }}>
                    <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                        <View style={{
                            margin: 20,
                            marginTop: 170,
                            width: 390,
                            height: 470,
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
                            <Text style={{fontSize: 40, backgroundColor:'#FC5858', fontWeight:'bold', padding:5, width:230, textAlign:'center', borderRadius: 20, marginTop:20}}>Edit Task</Text>

                            <View style={{backgroundColor:'#FC5858', padding:10, paddingTop:20, margin:10, marginTop:30, borderRadius: 20,marginBottom:30}}>

                                <Text style={{fontSize:30, marginBottom:10, marginStart:10}}>Title:</Text>

                                <TextInput style={{ borderWidth: 2, borderColor: "white", borderRadius: 20, paddingVertical: 6, paddingHorizontal: 16, width: 250, height: 100, color: "black", backgroundColor: 'white', fontSize: 18, marginStart:10, marginEnd:10, marginBottom:20}}
                                    placeholder='Task Title'
                                    value={todo}
                                    multiline
                                    onChangeText={(userText) => setTodo(userText)}
                                />
                                 
                            </View>
                            <View style={{flexDirection: 'row', justifyContent: 'space-between', alignContent: 'center', overflow: 'hidden', paddingStart:30}}>
                                <Pressable style={{backgroundColor: '#FB3854',width: '60%',height: 40,justifyContent: 'center',alignItems: 'center',borderRadius: 30,zIndex: 1}} onPress={() => handleUpdateTodo()}>
                                <Text style={{color: 'white', fontWeight: 'bold'}}>Save</Text>
                                </Pressable>

                                <Pressable style={{backgroundColor: 'white',width: '60%',height: 40,justifyContent: 'center',alignItems: 'center',borderRadius: 30, position: 'relative',left: -30, borderColor:'#FB3854', borderWidth:2}} onPress={() => setModalEditVisible(!modalEditVisible)}>
                                <Text style={{color: '#FC5858', fontWeight: 'bold'}}>Cancel</Text>
                                </Pressable>
                            </View> 
                        </View>
                    </View>
                </Modal>

                {/* Add Button */}
                <Pressable style={{position: 'absolute', bottom: 1, right: 1,}} onPress={() => setModalAddVisible(true)}>
                    <View style={{backgroundColor: '#FC5858',
                        width: 80,
                        height: 80,
                        borderRadius: 80,
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderWidth: 7,
                        borderColor: 'white',
                        bottom: 8,
                        right: 8,}}>
                    <Text style={{fontSize: 50, color: 'white',}}>+</Text>
                    </View>
                </Pressable>
            </View>
        </View>
    )
}

export default TodoScreen

const styles = StyleSheet.create({
});


import React, { useState, useEffect } from 'react';
import { FlatList, StyleSheet, Text, TextInput, Touchable, TouchableOpacity, View, } from 'react-native';
import { IconButton, Checkbox } from 'react-native-paper';
import Fallback from "../components/Fallback";
import AsyncStorage from '@react-native-async-storage/async-storage';

const TodoScreen = () => {
    // Init Local States
    const [todo, setTodo] = useState("");
    const [todoList, setTodoList] = useState([])
    const [editedTodo, setEditedTodo] = useState(null);
    const [checkedItems, setCheckedItems] = React.useState({});

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

    // Function to save the todoList to AsyncStorage
    const saveTodoListToStorage = async (list) => {
        try {
            await AsyncStorage.setItem('todoList', JSON.stringify(list));
        } catch (error) {
            console.error('Error saving todoList: ', error);
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
    };

    // Handle Delete Todo
    const handleDeleteTodo = (id) => {
        const updatedTodoList = todoList.filter((todo) => todo.id !== id);
        setTodoList(updatedTodoList);
        saveTodoListToStorage(updatedTodoList); // Save the updated list
    }

    // Handle Edit Todo
    const handleEditTodo = (todo) => {
        setEditedTodo(todo);
        setTodo(todo.title);
    }

    // Handle Update Todo
    const handleUpdateTodo = () => {
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
    }

    //render todo
    const renderTodos = ({ item, index }) => {
        return (
            <View style={{ backgroundColor: "white", borderRadius: 6, paddingHorizontal: 6, paddingVertical: 6, marginBottom: 12, flexDirection: 'row', alignItems: "center", paddingLeft: 15 }}>
                <Checkbox status={checkedItems[item.id] ? 'checked' : 'unchecked'} onPress={() => { const newCheckedItems = { ...checkedItems }; newCheckedItems[item.id] = !checkedItems[item.id]; setCheckedItems(newCheckedItems); }} />
                <Text style={{ color: 'black', fontSize: 20, fontWeight: '800', flex: 1, marginHorizontal: 10 }} numberOfLines={2} ellipsizeMode="tail">{item.title}</Text>
                <IconButton icon="pencil" iconColor='darkblue' onPress={() => handleEditTodo(item)} />
                <IconButton icon="trash-can" iconColor='red' onPress={() => handleDeleteTodo(item.id)} />
            </View>
        )
    }

    return (
        <View style={{
            marginHorizontal: 16, marginTop: 50,
        }}>
            {/* <Text>TodoScreen</Text> */}
            <View style={{ backgroundColor: '#FC5858', borderRadius: 10, borderTopRightRadius: 20, borderTopLeftRadius: 20 }}>
                <View style={{ flexDirection: 'row', alignItems: "center" }}>
                    <TextInput style={{ marginStart: 20, borderWidth: 2, borderColor: "white", borderRadius: 6, paddingVertical: 6, paddingHorizontal: 16, width: 260, height: 60, color: "black", marginEnd: 20, backgroundColor: 'white', fontSize: 20 }}
                        placeholder='Add a Task'
                        value={todo}
                        multiline
                        onChangeText={(userText) => setTodo(userText)}
                    />
                    {
                        editedTodo ? <TouchableOpacity
                            style={{
                                backgroundColor: "#000", borderRadius: 6, paddingVertical: 12, marginVertical: 34, alignItems: "center", justifyContent: 'center', width: 60,
                                height: 60
                            }}
                            onPress={() => handleUpdateTodo()}
                        >
                            <Text style={{ color: "#fff", fontWeight: "bold", fontSize: 15 }}>Save</Text>
                        </TouchableOpacity> :
                            <TouchableOpacity
                                style={{
                                    backgroundColor: "#000", borderRadius: 6, paddingVertical: 12, marginVertical: 34, alignItems: "center", justifyContent: 'center',
                                    width: 60, height: 60
                                }}
                                onPress={() => handleAddTodo()}
                            >
                                <Text style={{ color: "#fff", fontWeight: "bold", fontSize: 15, }}>Add</Text>
                            </TouchableOpacity>
                    }
                </View>
            </View>

            <View style={{ backgroundColor: '#FC5858', borderRadius: 10, borderBottomRightRadius: 20, borderBottomLeftRadius: 20, height: 600, marginTop: 30, padding: 20 }}>
                <View>
                    <Text style={{ fontSize: 50, textAlign: 'center', fontWeight: 'bold', marginVertical: 17 }}>
                        Task
                    </Text>
                </View>

                <View style={{ backgroundColor: '#dbdbdb', padding: 5, height: 450, borderRadius: 6 }}>
                    {todoList.length <= 0 && <Fallback />}
                    {/* RENDER TO DO LIST */}
                    <FlatList data={todoList} renderItem={renderTodos} />


                </View>
            </View>
        </View>
    )
}

export default TodoScreen

const styles = StyleSheet.create({
});


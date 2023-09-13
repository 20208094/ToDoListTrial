import React, { useState } from 'react';
import { FlatList, StyleSheet, Text, TextInput, Touchable, TouchableOpacity, View, } from 'react-native';
import { IconButton, Checkbox  } from 'react-native-paper';
import Fallback from "../components/Fallback";


// const dummyData = [
//     {
//         id: "01",
//         title: "Wash Car"
//     }, {
//         id: "02",
//         title: "Dry Clothes"
//     },
// ];


// console.log(Date.now().toString())

const TodoScreen = () => {
    // Init Local States
    const [todo, setTodo] = useState("");
    const [todoList, setTodoList] = useState([])
    const [editedTodo, setEditedTodo] = useState(null);
    const [checkedItems, setCheckedItems] = React.useState({});


    //Handle Add Todo
    const handleAddTodo = () => {
        //structure of a single todo item
        // {
        //     id:
        //     title:
        // }
        if (todo === "") {
            return;
        }
        setTodoList([...todoList, { id: Date.now().toString(), title: todo }]);
        setTodo("");
    };

    //Handle Delete Todo
    const handleDeleteTodo = (id) => {
        const updatedTodoList = todoList.filter((todo) => todo.id != id)

        setTodoList(updatedTodoList);
        setTodo("");
    }

    //Handle Edit Todo
    const handleEditTodo = (todo) => {

        setEditedTodo(todo);
        setTodo(todo.title);
    }

    //Handle Update Todo
    const handleUpdateTodo = () => {

        const updatedTodos = todoList.map((item) => {
            if (item.id === editedTodo.id) {
                return { ...item, title: todo }
            }

            return item;
        })

        setTodoList(updatedTodos);
        setEditedTodo(null);
        setTodo("");
    }

    //render todo
    const renderTodos = ({ item, index }) => {
        return (
            <View style={{ backgroundColor: "white", borderRadius: 6, paddingHorizontal: 6, paddingVertical: 6, marginBottom: 12, flexDirection: 'row', alignItems: "center", paddingLeft: 15 }}>
                <Checkbox status={checkedItems[item.id] ? 'checked' : 'unchecked'} onPress={() => { const newCheckedItems = {...checkedItems}; newCheckedItems[item.id] = !checkedItems[item.id]; setCheckedItems(newCheckedItems); }} />
                <Text style={{ color: 'black', fontSize: 20, fontWeight: '800', flex: 1, marginHorizontal: 10 }} numberOfLines={2} ellipsizeMode="tail">{item.title}</Text>
                <IconButton icon="pencil" iconColor='darkblue' onPress={() => handleEditTodo(item)} />
                <IconButton icon="trash-can" iconColor='red' onPress={() => handleDeleteTodo(item.id)} />
            </View>
        )
    }

    return (
        <View style={{
            marginHorizontal: 16, marginTop: 150, 
        }}>
            {/* <Text>TodoScreen</Text> */}
            <View style={{backgroundColor: '#FC5858', borderRadius: 10, borderTopRightRadius: 20, borderTopLeftRadius: 20}}>
                <View style={{ flexDirection: 'row', alignItems: "center" }}>
                    <TextInput style={{marginStart: 40, borderWidth: 2, borderColor: "white", borderRadius: 6, paddingVertical: 6, paddingHorizontal: 16, width: 300, height: 60, color: "black", marginEnd: 20, backgroundColor: 'white', fontSize: 20 }}
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
                            <Text style={{ color: "#fff", fontWeight: "bold", fontSize: 15,}}>Add</Text>
                        </TouchableOpacity>
                    }
                </View>
            </View>
            
            <View style={{backgroundColor: '#FC5858', borderRadius: 10, borderBottomRightRadius: 20, borderBottomLeftRadius: 20, height: 600, marginTop: 30, padding: 20}}>
                <View>
                    <Text style={{fontSize: 50, textAlign: 'center', fontWeight: 'bold', marginVertical: 17}}>
                        Task
                    </Text>
                </View>

                <View style={{backgroundColor: '#dbdbdb', padding: 5, height: 450, borderRadius: 6}}>
                    {/* RENDER TO DO LIST */}
                    <FlatList data={todoList} renderItem={renderTodos} />

                    {todoList.length <= 0 && <Fallback />}
                </View>
            </View>
        </View>
    )
}

export default TodoScreen

const styles = StyleSheet.create({
});


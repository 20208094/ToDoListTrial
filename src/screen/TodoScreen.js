import React, { useState } from 'react';
import { FlatList, StyleSheet, Text, TextInput, Touchable, TouchableOpacity, View, } from 'react-native';
import { IconButton } from 'react-native-paper';
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
            <View style={{ backgroundColor: "white", borderRadius: 6, paddingHorizontal: 6, paddingVertical: 5, marginBottom: 12, flexDirection: 'row', alignItems: "center", paddingLeft: 15 }}>
                <Text style={{ color: "black", fontSize: 20, fontWeight: "800", flex: 1 }}>{item.title}</Text>
                <IconButton icon="pencil" iconColor='black' onPress={() => handleEditTodo(item)} />
                <IconButton icon="trash-can" iconColor='black' onPress={() => handleDeleteTodo(item.id)} />
            </View>
        )
    }

    return (
        <View style={{
            marginHorizontal: 16, marginTop: 50, backgroundColor: "#FC5858",
            padding: 20,
            borderRadius: 20, height: 700
        }}>
            {/* <Text>TodoScreen</Text> */}

            <View style={{ flexDirection: 'row', alignItems: "center" }}>
                <TextInput style={{ borderWidth: 2, borderColor: "white", borderRadius: 6, paddingVertical: 6, paddingHorizontal: 16, width: 250, color: "white", marginEnd: 20 }}
                    placeholder='Add a Task'
                    value={todo}
                    onChangeText={(userText) => setTodo(userText)}
                />
                {
                    editedTodo ? <TouchableOpacity
                        style={{
                            backgroundColor: "#000", borderRadius: 6, paddingVertical: 12, marginVertical: 34, alignItems: "center", width: 60,
                            height: 60
                        }}
                        onPress={() => handleUpdateTodo()}
                    >
                        <Text style={{ color: "#fff", fontWeight: "bold", fontSize: 20 }}>Save</Text>
                    </TouchableOpacity> :
                        <TouchableOpacity
                            style={{
                                backgroundColor: "#000", borderRadius: 6, paddingVertical: 12, marginVertical: 34, alignItems: "center",
                                width: 60,
                                height: 60
                            }}
                            onPress={() => handleAddTodo()}
                        >
                            <Text style={{ color: "#fff", fontWeight: "bold", fontSize: 20 }}>Add</Text>
                        </TouchableOpacity>
                }
            </View>

            {/* RENDER TO DO LIST */}
            <FlatList data={todoList} renderItem={renderTodos} />

            {todoList.length <= 0 && <Fallback />}
        </View>

        
    )
}

export default TodoScreen

const styles = StyleSheet.create({
});

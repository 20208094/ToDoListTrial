import React, { useState } from 'react';
import { FlatList, StyleSheet, Text, TextInput, Touchable, TouchableOpacity, View } from 'react-native';
import { IconButton } from 'react-native-paper';

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
            <View style={{ backgroundColor: "#1e90ff", borderRadius: 6, paddingHorizontal: 6, paddingVertical: 12, marginBottom: 12, flexDirection: 'row', alignItems: "center" }}>
                <Text style={{ color: "#fff", fontSize: 20, fontWeight: "800", flex: 1 }}>{item.title}</Text>
                <IconButton icon="pencil" iconColor='#fff' onPress={() => handleEditTodo(item)} />
                <IconButton icon="trash-can" iconColor='#fff' onPress={() => handleDeleteTodo(item.id)} />
            </View>
        )
    }

    return (
        <View style={{ marginHorizontal: 16, marginTop: 50, gap: 20}}>
            <View style={styles.inputContainer}>
                {/* <Text>TodoScreen</Text> */}

                <TextInput style={{ borderWidth: 2, borderColor: "#1e90ff", borderRadius: 6, paddingVertical: 6, paddingHorizontal: 16, width: 300}}
                    placeholder='Add a Task'
                    value={todo}
                    onChangeText={(userText) => setTodo(userText)}
                />

                {
                    editedTodo ? <TouchableOpacity
                        style={{ backgroundColor: "#000", borderRadius: 6, paddingVertical: 12, marginVertical: 34, alignItems: "center" }}
                        onPress={() => handleUpdateTodo()}
                    >
                        <Text style={{ color: "#fff", fontWeight: "bold", fontSize: 20 }}>Save</Text>
                    </TouchableOpacity> :
                        <TouchableOpacity style={styles.addButton} onPress={() => handleAddTodo()}>
                            <Text style={styles.plusSign}>+</Text>
                        </TouchableOpacity>
                        
                }

                {/* RENDER TO DO LIST */}
            </View>
            <FlatList data={todoList} renderItem={renderTodos} />
        </View>

        
    )
}

export default TodoScreen

const styles = StyleSheet.create({

    inputContainer: {
        gap: 20,
        justifyContent: 'center',
        width: '100%',
        flexDirection: 'row'
    },
    plusSign: {
        backgroundColor: 'red',
        paddingHorizontal: 10,
        borderRadius: 10,
        fontSize: 44,
        color: 'white',
    },

});

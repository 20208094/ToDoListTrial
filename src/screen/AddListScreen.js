import React, { useState, useEffect } from 'react';
import { FlatList, StyleSheet, Text, TextInput, Touchable, TouchableOpacity, View, Modal, Pressable, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';


const AddListScreen = ({navigation}) => {

    // Init Local States
    const [todo, setTodo] = useState("");
    const [todoList, setTodoList] = useState([])
    const [editedTodo, setEditedTodo] = useState(null);
    const [deleteConfirmTodo, setDeleteConfirmTodo] = useState(null);
    const [checkedItems, setCheckedItems] = React.useState({});
    const [modalAddVisible, setModalAddVisible] = useState(false);
    const [modalEditVisible, setModalEditVisible] = useState(false);
    const [modalDeleteVisible, setModalDeleteVisible] = useState(false);

    
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

        navigation.navigate()

    };

  return (
    <View>
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
    </View>
  )
}

export default AddListScreen

const styles = StyleSheet.create({})
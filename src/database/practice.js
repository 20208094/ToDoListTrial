import React, { useEffect, useState } from 'react';
import { View, Text, Button, TextInput, FlatList } from 'react-native';
import { db, createTable } from '../database/todotask';

export default function App() {
  useEffect(() => {
    createTable();
    getItems();
  }, []);

  const [todo, setTodo] = useState('');
  const [items, setItems] = useState([]);
  const [editingItem, setEditingItem] = useState(null); // Track the item being edited
  const [editedText, setEditedText] = useState(''); // Track the edited text

  const addItem = (name) => {
    db.transaction(
      (tx) => {
        tx.executeSql(
          'INSERT INTO items (name) VALUES (?)',
          [name],
          (tx, results) => {
            console.log('Item added successfully');
            getItems();
          },
          (tx, error) => {
            console.error('Error adding item: ', error);
          }
        );
      },
      null
    );
  };

  const getItems = () => {
    db.transaction(
      (tx) => {
        tx.executeSql(
          'SELECT * FROM items',
          [],
          (tx, { rows }) => {
            const items = rows._array;
            setItems(items);
          },
          (tx, error) => {
            console.error('Error fetching items: ', error);
          }
        );
      },
      null
    );
  };

  const editItem = (id, newName) => {
    setEditingItem(id); // Set the currently edited item
    setEditedText(newName); // Set the edited text to the current item's name
  };

  const saveEditedItem = (id) => {
    editItem(id, editedText);
    db.transaction(
      (tx) => {
        tx.executeSql(
          'UPDATE items SET name = ? WHERE id = ?',
          [editedText, id],
          (tx, results) => {
            console.log('Item updated successfully');
            setEditingItem(null); // Reset the editing state
            getItems();
          },
          (tx, error) => {
            console.error('Error updating item: ', error);
          }
        );
      },
      null
    );
  };

  return (
    <View>
      
      <Button title="Add Item" onPress={() => addItem(todo)} />
      <Button title="Get Items" onPress={() => getItems()} />
      <TextInput
        placeholder="Enter a todo item"
        onChangeText={(userText) => setTodo(userText)}
        value={todo}
      />
      {editingItem !== null && (
        <View style={{backgroundColor: 'blue'}}>
          <TextInput
            placeholder="Edit item"
            onChangeText={(text) => setEditedText(text)}
            value={editedText}
          />
          <Button title="Save" onPress={() => saveEditedItem(editingItem)} />
        </View>
      )}
      <FlatList
        data={items}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View>
            <Text>{item.name}</Text>
            <Button title="Edit" onPress={() => editItem(item.id, item.name)} />
          </View>
        )}
      />

      
    </View>
  );
}

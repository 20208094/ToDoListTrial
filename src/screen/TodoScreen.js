// TodoScreen.js

import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, FlatList } from 'react-native';
import { initDatabase, insertItem, getAllItems, updateItem, deleteItem } from './Database';

const TodoScreen = ({ navigation }) => {
  const [itemName, setItemName] = useState('');
  const [items, setItems] = useState([]);
  const [selectedItemId, setSelectedItemId] = useState(null);

  useEffect(() => {
    initDatabase();
    fetchItems();
  }, []);

  const fetchItems = () => {
    console.log('Fetching items...');
    getAllItems((items) => {
      console.log('Fetched items:', items);
      setItems(items);
    });
  };

  const addItem = () => {
    if (selectedItemId) {
      // Update existing item
      updateItem(selectedItemId, itemName, () => {
        console.log('Item updated successfully');
        fetchItems();
        setItemName('');
        setSelectedItemId(null);
      });
    } else {
      // Add new item
      insertItem(itemName, (id) => {
        console.log('Item added with ID:', id);
        fetchItems();
        setItemName('');
      });
    }
  };

  const editItem = (id, name) => {
    setItemName(name);
    setSelectedItemId(id);
  };

  const deleteItemById = (id) => {
    deleteItem(id, () => {
      console.log('Item deleted successfully');
      fetchItems();
    });
  };

  return (
    <View style={{ padding: 20 }}>
      <TextInput
        style={{ marginBottom: 10, padding: 10, borderWidth: 1 }}
        placeholder="Enter item name"
        value={itemName}
        onChangeText={(text) => setItemName(text)}
      />
      <Button title="Add/Update Item" onPress={addItem} />
      <FlatList
        data={items}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <Text>{item.name}</Text>
            <Button title="Edit" onPress={() => editItem(item.id, item.name)} />
            <Button title="Delete" onPress={() => deleteItemById(item.id)} />
          </View>
        )}
        ListEmptyComponent={<Text>No items found</Text>}
      />
    </View>
  );
};

export default TodoScreen;

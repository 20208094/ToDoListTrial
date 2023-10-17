// database.js

import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabase('mydatabase.db');

const initDatabase = () => {
  db.transaction((tx) => {
    tx.executeSql(
      'CREATE TABLE IF NOT EXISTS items (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT)',
      [],
      () => {
        console.log('Table created successfully');
      },
      (error) => {
        console.log('Error creating table:', error);
      }
    );
  });
};

const insertItem = (name, callback) => {
  db.transaction((tx) => {
    tx.executeSql(
      'INSERT INTO items (name) VALUES (?)',
      [name],
      (_, results) => {
        callback(results.insertId);
      },
      (error) => {
        console.log('Error inserting item:', error);
      }
    );
  });
};

const updateItem = (id, name, callback) => {
  db.transaction((tx) => {
    tx.executeSql(
      'UPDATE items SET name = ? WHERE id = ?',
      [name, id],
      () => {
        callback();
      },
      (error) => {
        console.log('Error updating item:', error);
      }
    );
  });
};

const getAllItems = (callback) => {
  db.transaction((tx) => {
    tx.executeSql(
      'SELECT * FROM items',
      [],
      (_, results) => {
        const items = [];
        for (let i = 0; i < results.rows.length; i++) {
          items.push(results.rows.item(i));
        }
        callback(items);
      },
      (error) => {
        console.log('Error fetching items:', error);
      }
    );
  });
};

const deleteItem = (id, callback) => {
    db.transaction((tx) => {
      tx.executeSql(
        'DELETE FROM items WHERE id = ?',
        [id],
        () => {
          callback();
        },
        (error) => {
          console.log('Error deleting item:', error);
        }
      );
    });
  };
  
  export { initDatabase, insertItem, updateItem, deleteItem, getAllItems };

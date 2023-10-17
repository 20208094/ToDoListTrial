import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabase('mydb.db'); // Open or create a database called 'mydb.db'

// Create a table (you can call this function when your app starts or wherever needed)
const createTable = () => {
  db.transaction(tx => {
    tx.executeSql(
      'CREATE TABLE IF NOT EXISTS items (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT);',
      [],
      (tx, results) => {
        console.log('Table "items" created successfully');
      },
      error => {
        console.error('Error creating table: ', error);
      }
    );
  });
};

export { db, createTable };

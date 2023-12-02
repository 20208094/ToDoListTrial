// database.js

import * as SQLite from "expo-sqlite";

const db = SQLite.openDatabase("db21.db");

const initDatabase = () => {
  db.transaction((tx) => {
    tx.executeSql(
      "CREATE TABLE IF NOT EXISTS items (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, description TEXT, mins INTEGER, duedate DATETIME, duetime TEXT, status TEXT)",
      [],
      () => {
        console.log("Table created successfully");
      },
      (error) => {
        console.log("Error creating table:", error);
      }
    );
  });
};

const insertItem = (name, description, mins, duedate, duetime, callback) => {
  db.transaction(
    (tx) => {
      tx.executeSql(
        "INSERT INTO items (name, description, mins, duedate, duetime, status) VALUES (?, ?, ?, ?, ?, ?)",
        [name, description, mins, duedate, duetime, "unchecked"],
        (_, results) => {
          callback(results.insertId);
        },
        (error) => {
          console.log("Error executing SQL statement:", error);
          console.log("Failed SQL statement:", error.sqlStatement);
          console.log("SQL statement parameters:", error.sqlParams);
          callback(null); // Pass null to indicate an error to the callback
        }
      );
    },
    (error) => {
      console.log("Transaction error:", error);
    }
  );
};

const updateItem = (
  id,
  name,
  description,
  mins,
  duedate,
  duetime,
  callback
) => {
  db.transaction((tx) => {
    tx.executeSql(
      "UPDATE items SET name = ?, description = ?, mins = ?, duedate = ?, duetime = ? WHERE id = ?",
      [name, description, mins, duedate, duetime, id],
      () => {
        callback();
      },
      (error) => {
        console.log("Error updating item:", error);
      }
    );
  });
};

const updateItemStatus = (
  id,
  name,
  description,
  mins,
  duedate,
  duetime,
  status,
  callback
) => {
  db.transaction((tx) => {
    tx.executeSql(
      "UPDATE items SET name = ?, description = ?, mins = ?, duedate = ?, duetime = ?, status = ? WHERE id = ?",
      [name, description, mins, duedate, duetime, status, id],
      () => {
        callback();
      },
      (error) => {
        console.log("Error updating item:", error);
      }
    );
  });
};

const getAllItems = (callback) => {
  db.transaction((tx) => {
    tx.executeSql(
      "SELECT * FROM items",
      [],
      (_, results) => {
        const items = [];
        for (let i = 0; i < results.rows.length; i++) {
          items.push(results.rows.item(i));
        }
        callback(items);
      },
      (error) => {
        console.log("Error fetching items:", error);
      }
    );
  });
};

const getUncheckedItems = (callback) => {
  db.transaction((tx) => {
    tx.executeSql(
      'SELECT * FROM items WHERE status = "unchecked"',
      [],
      (_, results) => {
        const items = [];
        for (let i = 0; i < results.rows.length; i++) {
          items.push(results.rows.item(i));
        }
        callback(items);
      },
      (error) => {
        console.log("Error fetching items:", error);
      }
    );
  });
};

const getCheckedItems = (callback) => {
  db.transaction((tx) => {
    tx.executeSql(
      'SELECT * FROM items WHERE status = "checked"',
      [],
      (_, results) => {
        const items = [];
        for (let i = 0; i < results.rows.length; i++) {
          items.push(results.rows.item(i));
        }
        callback(items);
      },
      (error) => {
        console.log("Error fetching items:", error);
      }
    );
  });
};

const deleteItem = (id, callback) => {
  db.transaction((tx) => {
    tx.executeSql(
      "DELETE FROM items WHERE id = ?",
      [id],
      () => {
        callback();
      },
      (error) => {
        console.log("Error deleting item:", error);
      }
    );
  });
};

const getItemById = (id, callback) => {
  db.transaction((tx) => {
    tx.executeSql(
      "SELECT * FROM items WHERE id = ?",
      [id],
      (_, results) => {
        if (results.rows.length > 0) {
          const item = results.rows.item(0);
          callback(item);
        } else {
          console.log(`No item found with ID ${id}`);
          callback(null);
        }
      },
      (error) => {
        console.log("Error fetching item by ID:", error);
        callback(null);
      }
    );
  });
};

export {
  initDatabase,
  insertItem,
  updateItem,
  deleteItem,
  getAllItems,
  getUncheckedItems,
  getCheckedItems,
  getItemById,
  updateItemStatus,
};

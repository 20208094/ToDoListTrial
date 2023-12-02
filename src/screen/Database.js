// database.js

import { firebase } from "./../../config.js";

const db = firebase.firestore().collection("assignmentsTable");

//natangal callback
const insertItem = (name, description, mins, duedate, duetime, callback) => {
  if (!name && !description && !mins && !duedate && !duetime) {
    alert("empty fields");
    return;
  }

  const timestamp = firebase.firestore.FieldValue.serverTimestamp();
  const container = {
    createdAt: timestamp,
    name: name,
    description: description,
    mins: mins,
    duedate: duedate,
    duetime: duetime,
    status: "unchecked",
  };
  db.add(container)
    .then(() => {
      alert("Successfully added");
      callback(results.insertId);
      name = "";
      description = "";
      mins = "";
      duedate = "";
      duetime = "";
    })
    .catch((error) => {
      console.log(error);
    });
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
  if (!userInputNew) {
    alert("Empty fields detected");
    return;
  }
  db.doc(id)
    .update({
      name: name,
      description: description,
      mins: mins,
      duedate: duedate,
      duetime: duetime,
    })
    .then(() => {
      alert("Updated");
    })
    .catch((error) => {
      alert(error);
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
  //code here
};

const getAllItems = (callback) => {
  db.orderBy("createdAt", "desc").onSnapshot((querySnapshot) => {
    const dataFromFirebase = [];
    querySnapshot.forEach((document) => {
      // These variables here are the column names in your firestore
      const { createdAt, description, duedate, duetime, mins, name, status } =
        document.data();
      // Pushes the fetched data into the array container
      dataFromFirebase.push({
        id: document.id,
        description: description,
        duedate: duedate,
        duetime: duetime,
        mins: mins,
        name: name,
      });
    });
    callback(dataFromFirebase);
  });
};

const getUncheckedItems = (callback) => {
  db.where("status", "==", "unchecked")
    .orderBy("createdAt", "desc")
    .onSnapshot((querySnapshot) => {
      const dataFromFirebase = [];
      querySnapshot.forEach((document) => {
        // These variables here are the column names in your firestore
        const { createdAt, description, duedate, duetime, mins, name, status } =
          document.data();
        // Pushes the fetched data into the array container
        dataFromFirebase.push({
          id: document.id,
          description: description,
          duedate: duedate,
          duetime: duetime,
          mins: mins,
          name: name,
        });
      });
      callback(dataFromFirebase);
    });
};

const getCheckedItems = (callback) => {
  //code here
};

const deleteItem = (id, callback) => {
  db.doc(id)
    .delete()
    .then(() => {
      alert("Deleted");
      callback();
    })
    .catch((error) => {
      alert("error");
    });
};

const getItemById = (id, callback) => {
  db.where("id", "==", id)
    .onSnapshot((querySnapshot) => {
      const dataFromFirebase = [];
      querySnapshot.forEach((document) => {
        // These variables here are the column names in your firestore
        const { createdAt, description, duedate, duetime, mins, name, status } =
          document.data();
        // Pushes the fetched data into the array container
        dataFromFirebase.push({
          id: document.id,
          description: description,
          duedate: duedate,
          duetime: duetime,
          mins: mins,
          name: name,
        });
      });
      callback(dataFromFirebase);
    });
};

export {
  insertItem,
  updateItem,
  deleteItem,
  getAllItems,
  getUncheckedItems,
  getCheckedItems,
  getItemById,
  updateItemStatus,
};

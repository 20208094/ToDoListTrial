// database.js

import { firebase } from "./../../config.js";

const db = firebase.firestore().collection("assignmentsTable");

//natangal callback
const insertItem = (name, description, mins, duedate, duetime, submission) => {
  if (!name && !description && !mins && !duedate && !duetime && !submission) {
    alert("empty fields");
    return;
  }

  const timestamp = firebase.firestore.FieldValue.serverTimestamp();
  const container = {
    createdAt: timestamp,
    updatedAt: timestamp,
    name: name,
    description: description,
    mins: mins,
    duedate: duedate,
    duetime: duetime,
    status: "unchecked",
    submission: submission,
  };
  db.add(container)
    .then(() => {
      //callback(results.insertId);
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
  submission,
  callback
) => {
  const timestamp = firebase.firestore.FieldValue.serverTimestamp();
  if (!name && !description && !mins && !duedate && !duetime && !submission) {
    alert("Empty fields detected");
    return;
  }
  db.doc(id)
    .update({
      updatedAt: timestamp,
      name: name,
      description: description,
      mins: mins,
      duedate: duedate,
      duetime: duetime,
      submission: submission,
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
  submission,
  callback
) => {
  const timestamp = firebase.firestore.FieldValue.serverTimestamp();
  db.doc(id)
    .update({
      updatedAt: timestamp,
      name: name,
      description: description,
      mins: mins,
      duedate: duedate,
      duetime: duetime,
      status: status,
      submission: submission,
    })
    .catch((error) => {
      alert(error);
    });
  callback();
};

const getAllItems = (callback) => {
  db.orderBy("createdAt", "desc").onSnapshot((querySnapshot) => {
    const dataFromFirebase = [];
    querySnapshot.forEach((document) => {
      // These variables here are the column names in your firestore
      const {
        createdAt,
        description,
        duedate,
        duetime,
        mins,
        name,
        submission,
        status,
      } = document.data();
      // Pushes the fetched data into the array container
      dataFromFirebase.push({
        id: document.id,
        description: description,
        duedate: duedate,
        duetime: duetime,
        mins: mins,
        name: name,
        submission: submission,
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
        const {
          createdAt,
          description,
          duedate,
          duetime,
          mins,
          name,
          submission,
          status,
        } = document.data();
        // Pushes the fetched data into the array container
        dataFromFirebase.push({
          id: document.id,
          description: description,
          duedate: duedate,
          duetime: duetime,
          mins: mins,
          name: name,
          submission: submission,
        });
      });
      callback(dataFromFirebase);
    });
};

const getCheckedItems = (callback) => {
  db.where("status", "==", "checked")
    .orderBy("createdAt", "desc")
    .onSnapshot((querySnapshot) => {
      const dataFromFirebase = [];
      querySnapshot.forEach((document) => {
        // These variables here are the column names in your firestore
        const {
          createdAt,
          description,
          duedate,
          duetime,
          mins,
          name,
          submission,
          status,
        } = document.data();
        // Pushes the fetched data into the array container
        dataFromFirebase.push({
          id: document.id,
          description: description,
          duedate: duedate,
          duetime: duetime,
          mins: mins,
          name: name,
          status: status,
          submission: submission,
        });
      });
      callback(dataFromFirebase);
    });
};

const deleteItem = (id, callback) => {
  db.doc(id)
    .delete()
    .then(() => {
      callback();
    })
    .catch((error) => {
      alert("error");
    });
};

const getItemById = (id, callback) => {
  db.doc(id)
    .get()
    .then((document) => {
      if (document.exists) {
        const {
          createdAt,
          description,
          duedate,
          duetime,
          mins,
          name,
          status,
          submission,
        } = document.data();

        const dataFromFirebase = {
          id: document.id,
          createdAt: createdAt,
          description: description,
          duedate: duedate,
          duetime: duetime,
          mins: mins,
          name: name,
          status: status,
          submission: submission,
        };

        callback(dataFromFirebase);
      } else {
        console.log("No such document!");
      }
    })
    .catch((error) => {
      console.log("Error getting document:", error);
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

import firebase from "firebase/compat/app";
import { initializeApp } from "firebase/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyA8eRHoKyLgoqvPTa7feSJGwLP2t8_YwlE",
  authDomain: "assignment-list-g4.firebaseapp.com",
  projectId: "assignment-list-g4",
  storageBucket: "assignment-list-g4.appspot.com",
  messagingSenderId: "646425623538",
  appId: "1:646425623538:web:bfa4d7af55359bc164896b",
  measurementId: "G-1B3W80XCRS",
};

//  Checks whether the Firebase application has been initialized or not
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}
// const app = initializeApp(firebaseConfig)
export { firebase };

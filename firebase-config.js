// firebase-config.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js";
import { getFirestore, collection, query, orderBy, onSnapshot } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js";

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyBHCnAFJHBz95ugYztMkxBa5b6fwqCZqfo",
  authDomain: "temperature-cold-guard.firebaseapp.com",
  projectId: "temperature-cold-guard",
  storageBucket: "temperature-cold-guard",
  messagingSenderId: "29693405672",
  appId: "1:29693405672:web:9815de4ba98e7e4cf3dc5d"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db, collection, query, orderBy, onSnapshot };

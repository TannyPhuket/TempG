// js/firebase-config.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getDatabase, ref, onValue } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyBHCnAFJHBz95ugYztMkxBa5b6fwqCZqfo",
  authDomain: "temperature-cold-guard.firebaseapp.com",
  databaseURL: "https://temperature-cold-guard-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "temperature-cold-guard",
  storageBucket: "temperature-cold-guard.firebasestorage.app",
  messagingSenderId: "29693405672",
  appId: "1:29693405672:web:9815de4ba98e7e4cf3dc5d",
  measurementId: "G-XDHBRJ9S3W"
};

// Init Firebase
const app = initializeApp(firebaseConfig);

// Export DB
export const db = getDatabase(app);
export { ref, onValue };

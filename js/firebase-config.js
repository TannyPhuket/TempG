
// js/firebase-config.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.5.0/firebase-app.js";
import { getDatabase } from "https://www.gstatic.com/firebasejs/12.5.0/firebase-database.js";

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

const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);

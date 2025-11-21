// js/firebase-config.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-app.js";
import { getDatabase } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-database.js";

const firebaseConfig = {
  apiKey: "PUT_YOUR_API_KEY_HERE",
  authDomain: "temperature-cold-guard.firebaseapp.com",
  databaseURL: "https://temperature-cold-guard-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "temperature-cold-guard",
  storageBucket: "temperature-cold-guard.firebasestorage.app",
  messagingSenderId: "PUT_SENDER_ID",
  appId: "PUT_APP_ID"
};

const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);

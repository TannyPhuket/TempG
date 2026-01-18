<!-- firebase.js -->
<script type="module">
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-app.js";
import { getDatabase } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-database.js";

export const firebaseConfig = {
  apiKey: "AIzaSyBHCnAFJHBz95ugYztMkxBa5b6fwqCZqfo",
  authDomain: "temperature-cold-guard.firebaseapp.com",
  databaseURL: "https://temperature-cold-guard-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "temperature-cold-guard",
  storageBucket: "temperature-cold-guard.firebasestorage.app",
  messagingSenderId: "29693405672",
  appId: "1:29693405672:web:9815de4ba98e7e4cf3dc5d"
};

export const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);
</script>

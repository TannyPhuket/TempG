<!-- firebase.js -->
<script type="module">
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-app.js";
import { getDatabase } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-database.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyXXXX",
  authDomain: "temperature-cold-guard.firebaseapp.com",
  databaseURL: "https://temperature-cold-guard-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "temperature-cold-guard",
  storageBucket: "temperature-cold-guard.appspot.com",
  messagingSenderId: "XXXX",
  appId: "XXXX"
};

const app = initializeApp(firebaseConfig);

export const db = getDatabase(app);
export const auth = getAuth(app);
</script>

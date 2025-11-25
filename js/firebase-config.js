<script src="https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js"></script>
<script src="https://www.gstatic.com/firebasejs/11.0.1/firebase-database.js"></script>
<script>
const firebaseConfig = {
  apiKey: "AIzaSyBHCnAFJHBz95ugYztMkxBa5b6fwqCZqfo",
  authDomain: "temperature-cold-guard.firebaseapp.com",
  databaseURL: "https://temperature-cold-guard-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "temperature-cold-guard",
  storageBucket: "temperature-cold-guard.appspot.com",
  messagingSenderId: "xxxx",
  appId: "xxxx"
};
firebase.initializeApp(firebaseConfig);
const db = firebase.database();

async function login() {
  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value.trim();

  const snapshot = await db.ref("users/" + username).get();
  if (!snapshot.exists()) { alert("ไม่พบบัญชีผู้ใช้นี้"); return; }

  const data = snapshot.val();
  if(data.password !== password){ alert("รหัสผ่านไม่ถูกต้อง"); return; }

  const role = data.Role;
  if(role==="Seller") window.location="dashboard_seller.html";
  if(role==="Driver") window.location="dashboard_driver.html";
  if(role==="Buyer")  window.location="dashboard_buyer.html";
}
</script>

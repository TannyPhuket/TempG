<!-- auth.js -->
<script type="module">
import { auth } from "./firebase.js";
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-auth.js";

export function checkAuth(requiredRole){
  onAuthStateChanged(auth, user=>{
    const role = localStorage.getItem("role");
    if(!user || role !== requiredRole){
      location.href = "index.html";
    }
  });
}

export function logout(){
  signOut(auth).then(()=>{
    localStorage.clear();
    location.href="index.html";
  });
}
</script>

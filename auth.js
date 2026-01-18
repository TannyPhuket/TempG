<script src="auth.js"></script>
/* ===============================
   AUTH GUARD
================================ */

function checkAuth(requiredRole) {
    const isLoggedIn = localStorage.getItem("isLoggedIn");
    const role = localStorage.getItem("role");

    if (!isLoggedIn || !role) {
        window.location.href = "login.html";
        return;
    }

    if (requiredRole && role !== requiredRole) {
        alert("Access denied");
        window.location.href = "login.html";
    }
}

/* ===============================
   LOGOUT
================================ */
function logout() {
    localStorage.clear();
    window.location.href = "login.html";
}
</script>

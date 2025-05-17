import { auth, onAuthStateChanged } from './firebase-config.js';

onAuthStateChanged(auth, user => {
  if (user) {
    document.getElementById("adminEmail").textContent = user.email;
  } else {
    window.location.href = "login.html";
  }
});

document.getElementById("logoutBtn").addEventListener("click", async () => {
  try {
    await auth.signOut();
    window.location.href = "login.html";
  } catch (error) {
    console.error("Logout error:", error);
  }
});

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js";
import { getDatabase, ref, push, set, get, child, remove, query, orderByChild, equalTo, limitToLast } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-database.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-auth.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-storage.js";

const firebaseConfig = {
  apiKey: "AIzaSyCOBQLAgmchL7gvwyMUXP3LhzeCPcqzeeA",
  authDomain: "sanas-ae992.firebaseapp.com",
  databaseURL: "https://sanas-ae992-default-rtdb.asia-southeast1.firebasedatabase.app", // <-- Correct region!
  projectId: "sanas-ae992",
  storageBucket: "sanas-ae992.appspot.com",
  messagingSenderId: "331618755804",
  appId: "1:331618755804:web:46f700a781d58249bc4019"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const auth = getAuth(app);
const storage = getStorage(app);

export { 
  db, auth, ref, push, set, get, child, remove, 
  query, orderByChild, equalTo, limitToLast, 
  onAuthStateChanged, storage 
};
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { 
  getDatabase, ref, push, set, get, child 
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";
import { 
  getAuth, signInWithEmailAndPassword, onAuthStateChanged, signOut 
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyA-0ZJ7ZTZbMVjUT7HsWNz__bwHN1vLtNo",
  authDomain: "sanasbmt-c5884.firebaseapp.com",
  databaseURL: "https://sanasbmt-c5884-default-rtdb.firebaseio.com",
  projectId: "sanasbmt-c5884",
  storageBucket: "sanasbmt-c5884.appspot.com",
  messagingSenderId: "16153242421",
  appId: "1:16153242421:web:1f9b89c61fbb294f71ba7c"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const auth = getAuth(app);

export { db, auth, ref, push, set, get, child, signInWithEmailAndPassword, onAuthStateChanged, signOut };
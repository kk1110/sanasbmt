import { db, ref, push, get, child,remove, auth, onAuthStateChanged} from './firebase-config.js';


onAuthStateChanged(auth, user => {
  if (!user) {
    window.location.href = "login.html";
  }
});


const categoryList = document.getElementById("categoryList");

document.getElementById("categoryForm").addEventListener("submit", async function (e) {
  e.preventDefault();
  const name = document.getElementById("categoryName").value.trim();
  if (!name) return;

  const snapshot = await get(child(ref(db), 'categories'));
  const existing = snapshot.exists() ? Object.values(snapshot.val()).some(c => c.name.toLowerCase() === name.toLowerCase()) : false;
  if (existing) return alert("Category already exists!");

  await push(ref(db, 'categories'), { name });
  loadCategories();
  e.target.reset();
});

async function loadCategories() {
  categoryList.innerHTML = "";
  const snapshot = await get(child(ref(db), 'categories'));
  if (snapshot.exists()) {
    Object.entries(snapshot.val()).forEach(([key, cat]) => {
      categoryList.innerHTML += `<tr><td>${cat.name}</td><td><button onclick="deleteCategory('${key}')">Delete</button></td></tr>`;
    });
  }
}
loadCategories();

window.deleteCategory = async function (key) {
  if (confirm("Delete this category?")) {
    try {
      await remove(ref(db, `categories/${key}`));
      loadCategories();
    } catch (error) {
      console.error("Delete failed:", error);
      alert("Failed to delete category: " + error.message);
    }
  }
};

import { db, ref, push, get, child, remove, update, auth, onAuthStateChanged } from './firebase-config.js';

onAuthStateChanged(auth, user => {
  if (!user) window.location.href = "login.html";
});

const categoryList = document.getElementById("categoryList");
const form = document.getElementById("categoryForm");

form.addEventListener("submit", async function (e) {
  e.preventDefault();
  const name = document.getElementById("categoryName").value.trim();
  if (!name) return;

  const snapshot = await get(child(ref(db), 'categories'));
  const existing = snapshot.exists() ? Object.values(snapshot.val()).some(c => c.name.toLowerCase() === name.toLowerCase()) : false;
  if (existing) return alert("Category already exists!");

  await push(ref(db, 'categories'), { name });
  loadCategories();
  form.reset();
});

async function loadCategories() {
  categoryList.innerHTML = "";
  const snapshot = await get(child(ref(db), 'categories'));
  if (snapshot.exists()) {
    Object.entries(snapshot.val()).forEach(([key, cat]) => {
      categoryList.innerHTML += `
        <tr id="cat-row-${key}">
          <td>
            <span id="cat-name-${key}">${cat.name}</span>
            <input type="text" id="cat-edit-input-${key}" value="${cat.name}" style="display:none; width:120px;">
          </td>
          <td>
            <button onclick="editCategory('${key}')">Edit</button>
            <button onclick="deleteCategory('${key}')">Delete</button>
            <button id="cat-save-btn-${key}" style="display:none;" onclick="saveCategoryEdit('${key}')">Save</button>
            <button id="cat-cancel-btn-${key}" style="display:none;" onclick="cancelCategoryEdit('${key}', '${cat.name.replace(/'/g, "\\'")}')">Cancel</button>
          </td>
        </tr>
      `;
    });
  }
}
loadCategories();

window.deleteCategory = async function (key) {
  if (confirm("Delete this category?")) {
    await remove(ref(db, `categories/${key}`));
    loadCategories();
  }
};

window.editCategory = function(key) {
  document.getElementById(`cat-name-${key}`).style.display = "none";
  document.getElementById(`cat-edit-input-${key}`).style.display = "inline-block";
  document.getElementById(`cat-save-btn-${key}`).style.display = "inline-block";
  document.getElementById(`cat-cancel-btn-${key}`).style.display = "inline-block";
};

window.cancelCategoryEdit = function(key, originalName) {
  document.getElementById(`cat-name-${key}`).style.display = "inline";
  document.getElementById(`cat-edit-input-${key}`).style.display = "none";
  document.getElementById(`cat-save-btn-${key}`).style.display = "none";
  document.getElementById(`cat-cancel-btn-${key}`).style.display = "none";
  document.getElementById(`cat-edit-input-${key}`).value = originalName;
};

window.saveCategoryEdit = async function(key) {
  const newName = document.getElementById(`cat-edit-input-${key}`).value.trim();
  if (!newName) return alert("Category name cannot be empty.");
  // Check for duplicate
  const snapshot = await get(child(ref(db), 'categories'));
  if (snapshot.exists()) {
    const exists = Object.entries(snapshot.val()).some(([k, c]) => k !== key && c.name.toLowerCase() === newName.toLowerCase());
    if (exists) return alert("Category already exists!");
  }
  await update(ref(db, `categories/${key}`), { name: newName });
  loadCategories();
};
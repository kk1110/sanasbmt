import { db, ref, push, get, child, auth, onAuthStateChanged } from './firebase-config.js';

onAuthStateChanged(auth, user => {
  if (!user) window.location.href = "login.html";
});

const categorySelect = document.getElementById("productCategory");
const form = document.getElementById("addProductForm");

async function loadCategories() {
  categorySelect.innerHTML = '<option value="">Select Category</option>';
  const snapshot = await get(child(ref(db), 'categories'));
  if (snapshot.exists()) {
    Object.entries(snapshot.val()).forEach(([key, cat]) => {
      const opt = document.createElement('option');
      opt.value = key;
      opt.textContent = cat.name;
      categorySelect.appendChild(opt);
    });
  }
}
loadCategories();

form.addEventListener("submit", async function(e) {
  e.preventDefault();
  const name = document.getElementById("productName").value.trim();
  const category = categorySelect.value;
  const description = document.getElementById("productDescription").value.trim();
  const image = document.getElementById("productImage").value.trim();
  const isFeatured = document.getElementById("isFeatured").checked;

  if (!name || !category) return alert("Name and category are required.");

  await push(ref(db, 'products'), {
    name,
    category,
    description,
    image,
    isFeatured
  });

  alert("Product added!");
  form.reset();
});
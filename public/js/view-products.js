import { db, ref, get, child, remove, update } from './firebase-config.js';

const productList = document.getElementById("productList");
const editModal = document.getElementById("editModal");
const closeEditModal = document.getElementById("closeEditModal");
const editProductForm = document.getElementById("editProductForm");
const editProductName = document.getElementById("editProductName");
const editProductCategory = document.getElementById("editProductCategory");
const editProductDescription = document.getElementById("editProductDescription");
const editProductImage = document.getElementById("editProductImage");
const editIsFeatured = document.getElementById("editIsFeatured");

let categories = {};
let currentEditId = null;

// Load categories for dropdowns
async function loadCategories() {
  editProductCategory.innerHTML = '<option value="">Select Category</option>';
  const snapshot = await get(child(ref(db), 'categories'));
  if (snapshot.exists()) {
    categories = snapshot.val();
    Object.entries(categories).forEach(([key, cat]) => {
      const opt = document.createElement('option');
      opt.value = key;
      opt.textContent = cat.name;
      editProductCategory.appendChild(opt);
    });
  }
}

// Load products
async function loadProducts() {
  productList.innerHTML = "<tr><td colspan='4'>Loading...</td></tr>";
  const snapshot = await get(child(ref(db), 'products'));
  productList.innerHTML = "";
  if (snapshot.exists()) {
    Object.entries(snapshot.val()).forEach(([id, prod]) => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${prod.name}</td>
        <td>${categories[prod.category]?.name || '—'}</td>
        <td>${prod.isFeatured ? "Yes" : "No"}</td>
        <td>
          <button class="edit-btn" data-id="${id}">Edit</button>
          <button class="delete-btn" data-id="${id}">Delete</button>
        </td>
      `;
      productList.appendChild(tr);
    });
  } else {
    productList.innerHTML = "<tr><td colspan='4'>No products found.</td></tr>";
  }
}

// Delete product
productList.addEventListener("click", async (e) => {
  if (e.target.classList.contains("delete-btn")) {
    const id = e.target.getAttribute("data-id");
    if (confirm("Delete this product?")) {
      await remove(ref(db, "products/" + id));
      loadProducts();
    }
  }
  if (e.target.classList.contains("edit-btn")) {
    const id = e.target.getAttribute("data-id");
    openEditModal(id);
  }
});

// Open edit modal and fill form
async function openEditModal(id) {
  currentEditId = id;
  // Load product data
  const snapshot = await get(child(ref(db), "products/" + id));
  if (!snapshot.exists()) return;
  const prod = snapshot.val();
  editProductName.value = prod.name || "";
  editProductCategory.value = prod.category || "";
  editProductDescription.value = prod.description || "";
  editProductImage.value = prod.image || "";
  editIsFeatured.checked = !!prod.isFeatured;
  editModal.style.display = "flex";
}

// Close modal
closeEditModal.onclick = () => {
  editModal.style.display = "none";
  currentEditId = null;
};
window.onclick = (e) => {
  if (e.target === editModal) {
    editModal.style.display = "none";
    currentEditId = null;
  }
};

// Handle update
editProductForm.addEventListener("submit", async function (e) {
  e.preventDefault();
  if (!currentEditId) return;
  const updated = {
    name: editProductName.value.trim(),
    category: editProductCategory.value,
    description: editProductDescription.value.trim(),
    image: editProductImage.value.trim(),
    isFeatured: editIsFeatured.checked
  };
  await update(ref(db, "products/" + currentEditId), updated);
  editModal.style.display = "none";
  loadProducts();
});

// Initial load
window.addEventListener("DOMContentLoaded", async () => {
  await loadCategories();
  await loadProducts();
});
import {
  auth,
  onAuthStateChanged,
  db,
  ref,
  child,
  get,
  remove,
  set
} from './firebase-config.js';

// Check if user is logged in
onAuthStateChanged(auth, user => {
  if (!user) {
    window.location.href = "login.html";
  } else {
    loadProducts();
  }
});

// Load products and show category names
async function loadProducts() {
  const productList = document.getElementById("productList");
  productList.innerHTML = "";

  try {
    // Load categories
    const categorySnap = await get(child(ref(db), "categories"));
    const categoryLookup = {};
    if (categorySnap.exists()) {
      Object.entries(categorySnap.val()).forEach(([id, cat]) => {
        categoryLookup[id] = cat.name;
      });
    }

    // Load products
    const productSnap = await get(child(ref(db), "products"));
    if (productSnap.exists()) {
      const products = productSnap.val();

      Object.entries(products).forEach(([key, p]) => {
        const row = document.createElement("tr");

        const categoryName = categoryLookup[p.category] || "(Unknown Category)";

        row.innerHTML = `
          <td>${p.name || ""}</td>
          <td>${p.price || "0"} BHD</td>
          <td>${categoryName}</td>
          <td>${p.description || ""}</td>
        `;

        const actionCell = document.createElement("td");
        actionCell.className = "action-btns";

        const editBtn = document.createElement("button");
        editBtn.textContent = "Edit";
        editBtn.onclick = () => openEditForm(key, p, categoryLookup);

        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "Delete";
        deleteBtn.onclick = () => deleteProduct(key);

        actionCell.appendChild(editBtn);
        actionCell.appendChild(deleteBtn);
        row.appendChild(actionCell);

        productList.appendChild(row);
      });
    } else {
      productList.innerHTML = `<tr><td colspan="5">No products found.</td></tr>`;
    }
  } catch (error) {
    console.error("Error loading products:", error);
    productList.innerHTML = `<tr><td colspan="5">Failed to load products.</td></tr>`;
  }
}

// Delete product from Firebase
async function deleteProduct(key) {
  if (confirm("Are you sure you want to delete this product?")) {
    try {
      await remove(ref(db, `products/${key}`));
      alert("Product deleted.");
      loadProducts();
    } catch (error) {
      console.error("Delete error:", error);
      alert("Failed to delete product.");
    }
  }
}

// Open full edit form
function openEditForm(key, product, categoryLookup) {
  const modal = document.createElement("div");
  modal.className = "modal";

  modal.innerHTML = `
    <div class="modal-content">
      <h3>Edit Product</h3>
      <form id="editForm">
        <label>Product Name:</label>
        <input type="text" id="editName" value="${product.name}" required />

        <label>Price (BHD):</label>
        <input type="number" id="editPrice" value="${product.price}" required />

        <label>Category:</label>
        <select id="editCategory" required>
          ${Object.entries(categoryLookup).map(([catId, name]) => `
            <option value="${catId}" ${catId === product.category ? "selected" : ""}>${name}</option>
          `).join("")}
        </select>

        <label>Description:</label>
        <textarea id="editDescription" required>${product.description}</textarea>

        <label>Image URL:</label>
        <input type="url" id="editImage" value="${product.image || ''}" placeholder="https://..." />

        <label>
          <input type="checkbox" id="editFeatured" ${product.isFeatured ? "checked" : ""} />
          Featured Product
        </label>

        <div class="modal-buttons">
          <button type="submit">Update</button>
          <button type="button" id="cancelEdit">Cancel</button>
        </div>
      </form>
    </div>
  `;

  document.body.appendChild(modal);

  document.getElementById("cancelEdit").onclick = () => modal.remove();

  document.getElementById("editForm").onsubmit = async function (e) {
    e.preventDefault();

    const updatedProduct = {
      name: document.getElementById("editName").value.trim(),
      price: parseFloat(document.getElementById("editPrice").value),
      category: document.getElementById("editCategory").value,
      description: document.getElementById("editDescription").value.trim(),
      image: document.getElementById("editImage").value.trim(),
      isFeatured: document.getElementById("editFeatured").checked
    };

    try {
      await set(ref(db, `products/${key}`), updatedProduct);
      alert("Product updated successfully!");
      modal.remove();
      loadProducts();
    } catch (error) {
      console.error("Update error:", error);
      alert("Failed to update product.");
    }
  };
}

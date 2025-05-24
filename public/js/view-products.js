import { db, ref, get, child, remove, auth, onAuthStateChanged } from './firebase-config.js';

onAuthStateChanged(auth, user => {
  if (!user) window.location.href = "login.html";
});

const productList = document.getElementById("productList");
let categoryMap = {};

async function loadCategories() {
  const snapshot = await get(child(ref(db), 'categories'));
  if (snapshot.exists()) {
    Object.entries(snapshot.val()).forEach(([key, cat]) => {
      categoryMap[key] = cat.name;
    });
  }
}

async function loadProducts() {
  await loadCategories();
  productList.innerHTML = "";
  const snapshot = await get(child(ref(db), 'products'));
  if (snapshot.exists()) {
    Object.entries(snapshot.val()).forEach(([key, prod]) => {
      productList.innerHTML += `
        <tr>
          <td>${prod.name}</td>
          <td>${categoryMap[prod.category] || 'Uncategorized'}</td>
          <td>${prod.isFeatured ? 'Yes' : 'No'}</td>
          <td>
            <button onclick="deleteProduct('${key}')">Delete</button>
          </td>
        </tr>
      `;
    });
  }
}
loadProducts();

window.deleteProduct = async function(key) {
  if (confirm("Delete this product?")) {
    await remove(ref(db, `products/${key}`));
    loadProducts();
  }
};
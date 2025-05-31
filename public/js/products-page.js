import { db, ref, get, child } from './firebase-config.js';

const productContainer = document.getElementById("all-products");
const categorySelect = document.getElementById("category-filter");
const searchInput = document.getElementById("search-input");
let categoryMap = {};

async function loadCategories() {
  categorySelect.innerHTML = '<option value="all">All Categories</option>';
  const snapshot = await get(child(ref(db), 'categories'));
  if (snapshot.exists()) {
    Object.entries(snapshot.val()).forEach(([key, cat]) => {
      categoryMap[key] = cat.name;
      const opt = document.createElement('option');
      opt.value = key;
      opt.textContent = cat.name;
      categorySelect.appendChild(opt);
    });
  }
}
loadCategories();

async function loadProducts() {
  productContainer.innerHTML = '<div class="loading-spinner"><div class="spinner"></div><p>Loading products...</p></div>';
  const snapshot = await get(child(ref(db), 'products'));
  productContainer.innerHTML = "";
  if (snapshot.exists()) {
    let found = false;
    Object.entries(snapshot.val()).forEach(([key, prod]) => {
      const selectedCat = categorySelect.value;
      const searchVal = searchInput.value.trim().toLowerCase();
      if (
        (selectedCat === "all" || prod.category === selectedCat) &&
        (!searchVal ||
          prod.name.toLowerCase().includes(searchVal) ||
          (prod.description && prod.description.toLowerCase().includes(searchVal)))
      ) {
        productContainer.appendChild(createProductCard(prod, key));
        found = true;
      }
    });
    if (!found) productContainer.innerHTML = "<p>No products found.</p>";
  } else {
    productContainer.innerHTML = "<p>No products found.</p>";
  }
}

function createProductCard(product, id) {
  const card = document.createElement('div');
  card.className = 'product-card';
  const featuredBadge = product.isFeatured
    ? '<span class="featured-badge" style="background:#ffc107;color:#222;">Top Selling</span>'
    : '';
  const productUrl = `${window.location.origin}/product-details.html?id=${id}`;
  const whatsappMsg = `I'm interested in ${product.name}.\n${product.description || ''}\n${productUrl}`;
  card.innerHTML = `
    <div class="product-image">
      <img src="${product.image || '/images/product-placeholder.jpg'}" alt="${product.name}">
      ${featuredBadge}
    </div>
    <div class="product-info">
      <h3>${product.name}</h3>
      <p class="description">${product.description || ''}</p>
    </div>
    <div class="product-actions">
      <a class="whatsapp-btn" href="https://wa.me/97333553787?text=I'm%20interested%20in%20${encodeURIComponent(whatsappMsg)}" target="_blank">
      <i class="fab fa-whatsapp"></i> Enquire
    </a>
    </div>
  `;
  return card;
}

categorySelect.addEventListener("change", loadProducts);
searchInput.addEventListener("input", loadProducts);

window.addEventListener("DOMContentLoaded", loadProducts);
import { db, ref, get, child } from './firebase-config.js';

const featuredContainer = document.getElementById('featured-products');
let categoryMap = {};

async function loadCategories() {
  const snapshot = await get(child(ref(db), 'categories'));
  if (snapshot.exists()) {
    Object.entries(snapshot.val()).forEach(([key, cat]) => {
      categoryMap[key] = cat.name;
    });
  }
}
await loadCategories();

async function loadFeaturedProducts() {
  if (!featuredContainer) return;
  featuredContainer.innerHTML = '<div class="loading-spinner"><div class="spinner"></div><p>Loading...</p></div>';
  const snapshot = await get(child(ref(db), 'products'));
  featuredContainer.innerHTML = "";
  if (snapshot.exists()) {
    let found = false;
    Object.entries(snapshot.val()).forEach(([key, prod]) => {
      if (prod.isFeatured) {
        featuredContainer.appendChild(createProductCard(prod, key));
        found = true;
      }
    });
    if (!found) featuredContainer.innerHTML = "<p>No featured products available.</p>";
  } else {
    featuredContainer.innerHTML = "<p>No featured products available.</p>";
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
      <a href="https://wa.me/97333553787?text=${encodeURIComponent(whatsappMsg)}"
         class="btn whatsapp-btn" target="_blank">
        <i class="fab fa-whatsapp"></i> Enquire
      </a>
    </div>
  `;
  return card;
}

window.addEventListener("DOMContentLoaded", loadFeaturedProducts);
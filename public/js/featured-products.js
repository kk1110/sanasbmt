import { db, ref, get, child } from './firebase-config.js';

const featuredContainer = document.getElementById('featured-products');
let categoryMap = {};

// Load categories for display (optional, if you want to show category names)
async function loadCategories() {
  const snapshot = await get(child(ref(db), 'categories'));
  if (snapshot.exists()) {
    Object.entries(snapshot.val()).forEach(([key, cat]) => {
      categoryMap[key] = cat.name;
    });
  }
}

// Create a product card element
function createProductCard(product, id) {
  const card = document.createElement('div');
  const productUrl = `${window.location.origin}/product-details.html?id=${id}`;
   const whatsappMsg = `I'm interested in ${product.name}.\n${product.description || ''}\n${productUrl}`;
  card.className = 'product-card';
 
card.innerHTML = `
  <div class="product-image">
    <img src="${product.image || '/images/product-placeholder.jpg'}" alt="${product.name}">
  </div>
  <div class="product-info">
    <h3>${product.name}</h3>
    <p class="description">${product.description || ''}</p>
    ${product.category && categoryMap[product.category] ? `<p class="category">${categoryMap[product.category]}</p>` : ''}
    <a class="whatsapp-btn" href="https://wa.me/97333553787?text=I'm%20interested%20in%20${encodeURIComponent(whatsappMsg)}" target="_blank">
      <i class="fab fa-whatsapp"></i> Enquire
    </a>
  </div>
`;

  return card;
}

async function loadFeaturedProducts() {
  if (!featuredContainer) return;
  featuredContainer.innerHTML = `
    <div class="loading-spinner">
      <div class="spinner"></div>
      <p>Loading featured products...</p>
    </div>
  `;
  await loadCategories();
  const snapshot = await get(child(ref(db), 'products'));
  featuredContainer.innerHTML = "";
  if (snapshot.exists()) {
    let found = false;
    Object.entries(snapshot.val()).forEach(([key, prod]) => {
      // Accept both boolean true and string "true" for legacy data
      if (prod.isFeatured === true || prod.isFeatured === "true") {
        featuredContainer.appendChild(createProductCard(prod, key));
        found = true;
      }
    });
    if (!found) {
      featuredContainer.innerHTML = "<p>No featured products available.</p>";
    }
  } else {
    featuredContainer.innerHTML = "<p>No featured products available.</p>";
  }
}

window.addEventListener("DOMContentLoaded", loadFeaturedProducts);
import { db, ref, get, child } from './firebase-config.js';

document.addEventListener('DOMContentLoaded', function() {
    let categoryMap = {};

    // Load categories for filter dropdown and for mapping categoryId to name
    function loadCategoriesAndProducts() {
        const categoryFilter = document.getElementById('category-filter');
        if (!categoryFilter) return;
        categoryFilter.innerHTML = '<option value="all">All Categories</option>';
        get(child(ref(db), 'categories')).then((snapshot) => {
            if (snapshot.exists()) {
                snapshot.forEach((childSnapshot) => {
                    const category = childSnapshot.val();
                    categoryMap[childSnapshot.key] = category.name;
                    const option = document.createElement('option');
                    option.value = childSnapshot.key;
                    option.textContent = category.name;
                    categoryFilter.appendChild(option);
                });
            }
            loadProducts(); // Load products after categories are loaded
        }).catch((error) => {
            console.error("Error loading categories: ", error);
        });
    }

    // Create product card element
 function createProductCard(product, id) {
    const card = document.createElement('div');
    card.className = 'product-card';
    const featuredBadge = product.isFeatured ? 
        '<span class="featured-badge">Featured</span>' : '';
    // Build product link (adjust the URL if your details page is different)
    const productUrl = `${window.location.origin}/product-details.html?id=${id}`;
    // WhatsApp message with product details and link
    const whatsappMsg = 
      `I'm interested in ${product.name} (${product.price} BHD).\n${product.description || ''}\n${productUrl}`;
    card.innerHTML = `
        <div class="product-image">
            <img src="${product.image || '/images/product-placeholder.jpg'}" alt="${product.name}">
            ${featuredBadge}
        </div>
        <div class="product-info">
            <h3>${product.name}</h3>
            <p class="price">${product.price} BHD</p>
            <p class="category">${categoryMap[product.category] || 'Uncategorized'}</p>
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

    // Load products with optional filtering
    function loadProducts(categoryId = 'all', searchTerm = '') {
        const container = document.getElementById('all-products');
        container.innerHTML = '<div class="loading-spinner"><div class="spinner"></div><p>Loading products...</p></div>';
        get(child(ref(db), 'products')).then((snapshot) => {
            container.innerHTML = '';
            if (!snapshot.exists()) {
                container.innerHTML = '<p>No products found.</p>';
                return;
            }
            let hasMatches = false;
            snapshot.forEach(childSnapshot => {
                const product = childSnapshot.val();
                const id = childSnapshot.key;
                // Filter by category
              if (categoryId !== 'all' && product.category !== categoryId) return;
                // Filter by search
                if (searchTerm &&
                    !product.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
                    !(product.description && product.description.toLowerCase().includes(searchTerm.toLowerCase()))
                ) return;
                container.appendChild(createProductCard(product, id));
                hasMatches = true;
            });
            if (!hasMatches) {
                container.innerHTML = '<p>No products match your criteria.</p>';
            }
        }).catch((error) => {
            console.error("Error getting products: ", error);
            container.innerHTML = '<p>Error loading products. Please try again later.</p>';
        });
    }

    // Initialize products page
    loadCategoriesAndProducts();

    // Search functionality
    document.getElementById('search-input').addEventListener('input', function() {
        const searchTerm = this.value;
        const categoryId = document.getElementById('category-filter').value;
        loadProducts(categoryId, searchTerm);
    });
    // Category filter
    document.getElementById('category-filter').addEventListener('change', function() {
        const categoryId = this.value;
        const searchTerm = document.getElementById('search-input').value;
        loadProducts(categoryId, searchTerm);
    });
});
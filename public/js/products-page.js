document.addEventListener('DOMContentLoaded', function() {
    if (typeof db === 'undefined') {
        console.error('Firebase not initialized. Make sure main.js is loaded first.');
        return;
    }

    let categoryMap = {};

    // Load categories for filter dropdown and for mapping categoryId to name
    function loadCategories() {
        const categoryFilter = document.getElementById('category-filter');
        if (!categoryFilter) return;
        categoryFilter.innerHTML = '<option value="all">All Categories</option>';
        db.collection('categories').orderBy('name').get()
            .then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    const category = doc.data();
                    categoryMap[doc.id] = category.name;
                    const option = document.createElement('option');
                    option.value = doc.id;
                    option.textContent = category.name;
                    categoryFilter.appendChild(option);
                });
            })
            .catch((error) => {
                console.error("Error loading categories: ", error);
            });
    }

    // Create product card element
    function createProductCard(product) {
        const card = document.createElement('div');
        card.className = 'product-card';
        const featuredBadge = product.isFeatured ? 
            '<span class="featured-badge">Featured</span>' : '';
        card.innerHTML = `
            <img src="${product.image || '/images/product-placeholder.jpg'}" alt="${product.name}">
            <div class="product-info">
                <h3>${product.name}</h3>
                <p class="price">${product.price} BHD</p>
                <p class="category">${categoryMap[product.categoryId] || 'Uncategorized'}</p>
                ${featuredBadge}
            </div>
            <div class="product-actions">
                <button class="btn" onclick="addToCart('${product.id}')">Add to Cart</button>
                <a href="https://wa.me/97333553787?text=I'm interested in ${encodeURIComponent(product.name)} (ID: ${product.id})" 
                   class="btn whatsapp-btn" target="_blank"><i class="fab fa-whatsapp"></i> Enquire</a>
            </div>
        `;
        return card;
    }

    // Load products with optional filtering
    function loadProducts(categoryId = 'all', searchTerm = '') {
        const container = document.getElementById('all-products');
        container.innerHTML = '<div class="loading-spinner"><div class="spinner"></div><p>Loading products...</p></div>';
        let query = db.collection('products').orderBy('createdAt', 'desc');
        if (categoryId !== 'all') {
            query = query.where('categoryId', '==', categoryId);
        }
        query.get().then((querySnapshot) => {
            container.innerHTML = '';
            if (querySnapshot.empty) {
                container.innerHTML = '<p>No products found.</p>';
                return;
            }
            let hasMatches = false;
            querySnapshot.forEach((doc) => {
                const product = doc.data();
                product.id = doc.id;
                // Apply search filter if provided
                if (!searchTerm || 
                    product.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                    (product.description && product.description.toLowerCase().includes(searchTerm.toLowerCase()))) {
                    container.appendChild(createProductCard(product));
                    hasMatches = true;
                }
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
    loadCategories();
    // Wait a bit to ensure categories are loaded before loading products (for mapping)
    setTimeout(() => loadProducts(), 500);

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

// Global cart function (compatible with main.js)
function addToCart(productId) {
    console.log(`Product ${productId} added to cart`);
    alert('Product added to cart!');
}
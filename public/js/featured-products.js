import { db, ref, get, query, orderByChild, equalTo, limitToLast, child } from './firebase-config.js';

let categoryMap = {};

document.addEventListener('DOMContentLoaded', function() {
    // 1. Load categories first
    get(child(ref(db), 'categories')).then((snapshot) => {
        if (snapshot.exists()) {
            snapshot.forEach((catSnap) => {
                categoryMap[catSnap.key] = catSnap.val().name;
            });
        }
        // 2. Now load featured products
        loadFeaturedProducts();
    });
});

function loadFeaturedProducts() {
    if (document.getElementById('featured-products')) {
        const productsRef = ref(db, 'products');
        const featuredQuery = query(
            productsRef,
            orderByChild('isFeatured'),
            equalTo(true),
            limitToLast(4)
        );

        get(featuredQuery)
            .then((snapshot) => {
                const container = document.getElementById('featured-products');
                container.innerHTML = '';
                if (snapshot.exists()) {
                    snapshot.forEach((childSnapshot) => {
                        const product = childSnapshot.val();
                        const id = childSnapshot.key;
                        container.appendChild(createProductCard(product, id));
                    });
                } else {
                    container.innerHTML = '<p>No featured products available.</p>';
                }
            })
            .catch((error) => {
                console.error("Error loading featured products: ", error);
                document.getElementById('featured-products').innerHTML =
                    '<p class="error">Error loading featured products.</p>';
            });
    }
}

function createProductCard(product, id) {
    const card = document.createElement('div');
    card.className = 'product-card';
    const featuredBadge = product.isFeatured ?
    '<span class="featured-badge" style="background:#ffc107;color:#222;">Top Selling</span>' : '';
    const productUrl = `${window.location.origin}/product-details.html?id=${id}`;
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
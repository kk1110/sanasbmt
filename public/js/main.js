// assets/js/main.js
document.addEventListener('DOMContentLoaded', function() {
    // Mobile Menu Toggle
    const mobileMenuBtn = document.querySelector('.mobile-menu');
    const nav = document.querySelector('nav');
    
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', function() {
            nav.classList.toggle('active');
        });
    }

    // Initialize Firebase
    const firebaseConfig = {
        apiKey: "YOUR_API_KEY",
        authDomain: "YOUR_AUTH_DOMAIN",
        projectId: "YOUR_PROJECT_ID",
        storageBucket: "YOUR_STORAGE_BUCKET",
        messagingSenderId: "YOUR_SENDER_ID",
        appId: "YOUR_APP_ID"
    };
    
    // Initialize Firebase if not already initialized
    if (!firebase.apps.length) {
        firebase.initializeApp(firebaseConfig);
    }
    const db = firebase.firestore();

    // Load products from Firestore
    function loadProducts(containerId, featuredOnly = false) {
        const container = document.getElementById(containerId);
        if (!container) return;

        let query = db.collection('products').orderBy('createdAt', 'desc');
        
        if (featuredOnly) {
            query = query.where('featured', '==', true);
        }

        query.get().then((querySnapshot) => {
            container.innerHTML = ''; // Clear loading state
            
            if (querySnapshot.empty) {
                container.innerHTML = '<p>No products found.</p>';
                return;
            }

            querySnapshot.forEach((doc) => {
                const product = doc.data();
                product.id = doc.id;
                container.appendChild(createProductCard(product));
            });
        }).catch((error) => {
            console.error("Error getting products: ", error);
            container.innerHTML = '<p>Error loading products. Please try again later.</p>';
        });
    }

    // Load featured products on home page
    if (document.getElementById('featured-products')) {
        loadProducts('featured-products', true);
    }

    // Load all products on products page
    if (document.getElementById('all-products')) {
        loadProducts('all-products');
        setupFilters();
    }

    // Contact form submission
    if (document.getElementById('contactForm')) {
        setupContactForm();
    }

    function createProductCard(product) {
        const card = document.createElement('div');
        card.className = 'product-card';
        
        card.innerHTML = `
            <div class="product-image">
                <img src="${product.image}" alt="${product.name}" onerror="this.src='assets/images/placeholder.jpg'">
            </div>
            <div class="product-info">
                <h3>${product.name}</h3>
                <p>${product.description || 'No description available'}</p>
                <div class="product-price">$${product.price.toFixed(2)}</div>
                <button class="btn" onclick="addToCart('${product.id}')">Add to Cart</button>
            </div>
        `;
        
        return card;
    }

    function setupFilters() {
        const searchInput = document.getElementById('search-input');
        const categoryFilter = document.getElementById('category-filter');
        const productsContainer = document.getElementById('all-products');
        
        if (!searchInput || !categoryFilter) return;

        function filterProducts() {
            const searchTerm = searchInput.value.toLowerCase();
            const category = categoryFilter.value;
            
            let query = db.collection('products');
            
            if (category !== 'all') {
                query = query.where('category', '==', category);
            }
            
            query.get().then((querySnapshot) => {
                productsContainer.innerHTML = '';
                
                querySnapshot.forEach((doc) => {
                    const product = doc.data();
                    product.id = doc.id;
                    
                    // Client-side search filtering
                    if (product.name.toLowerCase().includes(searchTerm)) {
                        productsContainer.appendChild(createProductCard(product));
                    }
                });
                
                if (productsContainer.innerHTML === '') {
                    productsContainer.innerHTML = '<p>No products match your criteria.</p>';
                }
            });
        }
        
        searchInput.addEventListener('input', filterProducts);
        categoryFilter.addEventListener('change', filterProducts);
    }

    function setupContactForm() {
        const contactForm = document.getElementById('contactForm');
        
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formData = {
                name: document.getElementById('name').value,
                email: document.getElementById('email').value,
                subject: document.getElementById('subject').value,
                message: document.getElementById('message').value,
                timestamp: firebase.firestore.FieldValue.serverTimestamp()
            };
            
            // Save to Firestore
            db.collection('contacts').add(formData)
                .then(() => {
                    alert('Thank you for your message! We will get back to you soon.');
                    contactForm.reset();
                })
                .catch((error) => {
                    console.error('Error saving contact: ', error);
                    alert('There was an error sending your message. Please try again.');
                });
        });
    }
});

// Global function for cart
function addToCart(productId) {
    // In a real app, you would add to Firestore or localStorage
    console.log(`Product ${productId} added to cart`);
    alert('Product added to cart!');
}
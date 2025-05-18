document.addEventListener('DOMContentLoaded', function() {
    if (document.getElementById('featured-products')) {
        // Reference to your Firebase database
        const dbRef = firebase.database().ref('products');
        
        // Query only featured products
        dbRef.orderByChild('isFeatured').equalTo(true).limitToLast(4).once('value')
            .then((snapshot) => {
                const container = document.getElementById('featured-products');
                container.innerHTML = '';
                
                if (snapshot.exists()) {
                    snapshot.forEach((childSnapshot) => {
                        const product = childSnapshot.val();
                        product.id = childSnapshot.key;
                        container.appendChild(createProductCard(product, true));
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
});

function createProductCard(product, isFeatured = false) {
    const card = document.createElement('div');
    card.className = 'product-card';
    
    card.innerHTML = `
        <div class="product-image">
            <img src="${product.image || '/images/product-placeholder.jpg'}" alt="${product.name}">
        </div>
        <h3>${product.name}</h3>
        <p class="price">${product.price}BHD</p>
        ${isFeatured ? 
            `<a href="products.html#${product.id}" class="btn">View Details</a>` : 
            `<button class="btn" onclick="addToCart('${product.id}')">Add to Cart</button>
             <a href="https://wa.me/97333553787?text=I'm interested in ${encodeURIComponent(product.name)}" 
                class="btn whatsapp-btn" target="_blank"><i class="fab fa-whatsapp"></i> Enquire</a>`
        }
    `;
    
    return card;
}
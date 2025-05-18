// Mobile Menu Toggle
document.addEventListener('DOMContentLoaded', function() {
  const mobileMenuBtn = document.querySelector('.mobile-menu');
  const navLinks = document.querySelector('.nav-links');
  
  if (mobileMenuBtn && navLinks) {
    mobileMenuBtn.addEventListener('click', function() {
      navLinks.classList.toggle('active');
      this.classList.toggle('active');
    });
    
    // Close menu when clicking on links
    document.querySelectorAll('.nav-links a').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('active');
        mobileMenuBtn.classList.remove('active');
      });
    });
  }

  // ==================== FIREBASE INITIALIZATION ====================
  const firebaseConfig = {
    apiKey: "AIzaSyA-0ZJ7ZTZbMVjUT7HsWNz__bwHN1vLtNo",
    authDomain: "sanasbmt-c5884.firebaseapp.com",
    projectId: "sanasbmt-c5884",
    storageBucket: "sanasbmt-c5884.appspot.com",
    messagingSenderId: "16153242421",
    appId: "1:16153242421:web:1f9b89c61fbb294f71ba7c"
  };
  
  if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
  }
  window.db = firebase.firestore(); // <-- Make db global

  // Products Page Functionality
  function loadCategories() {
    const categoryFilter = document.getElementById('category-filter');
    if (!categoryFilter) return;

    db.collection('categories').orderBy('name').get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          const category = doc.data();
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

  function loadProducts(containerId, categoryId = 'all', searchTerm = '') {
    const container = document.getElementById(containerId);
    if (!container) return;

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

      querySnapshot.forEach((doc) => {
        const product = doc.data();
        product.id = doc.id;
        
        // Apply search filter if provided
        if (!searchTerm || product.name.toLowerCase().includes(searchTerm.toLowerCase())) {
          container.appendChild(createProductCard(product));
        }
      });
      
      if (container.innerHTML === '') {
        container.innerHTML = '<p>No products match your criteria.</p>';
      }
    }).catch((error) => {
      console.error("Error getting products: ", error);
      container.innerHTML = '<p>Error loading products. Please try again later.</p>';
    });
  }

  // Initialize products page
  if (document.getElementById('all-products')) {
    loadCategories();
    loadProducts('all-products');
    
    // Search functionality
    document.getElementById('search-input').addEventListener('input', function() {
      const searchTerm = this.value;
      const categoryId = document.getElementById('category-filter').value;
      loadProducts('all-products', categoryId, searchTerm);
    });
    
    // Category filter
    document.getElementById('category-filter').addEventListener('change', function() {
      const categoryId = this.value;
      const searchTerm = document.getElementById('search-input').value;
      loadProducts('all-products', categoryId, searchTerm);
    });
  }

 

  // ==================== WHATSAPP FLOATING BUTTON ====================
  const whatsappFloat = document.querySelector('.whatsapp-float');
  if (whatsappFloat) {
    whatsappFloat.addEventListener('click', function(e) {
      if (e.target.tagName === 'A') return;
      window.open('https://wa.me/97313112545', '_blank');
    });
  }
});

// Global cart function
function addToCart(productId) {
  // Implement your cart logic here
  console.log(`Product ${productId} added to cart`);
  alert('Product added to cart!');
}
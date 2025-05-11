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
  };

    // ==================== FIREBASE INITIALIZATION ====================
    const firebaseConfig = {
        apiKey: "YOUR_API_KEY",
        authDomain: "YOUR_AUTH_DOMAIN",
        projectId: "YOUR_PROJECT_ID",
        storageBucket: "YOUR_STORAGE_BUCKET",
        messagingSenderId: "YOUR_SENDER_ID",
        appId: "YOUR_APP_ID"
    };
    
    if (!firebase.apps.length) {
        firebase.initializeApp(firebaseConfig);
    }
    const db = firebase.firestore();

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

    // ==================== ENHANCED CONTACT FORM ====================
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        const contactInput = document.getElementById('contact');
        const contactIcon = document.querySelector('.input-with-icon .input-icon');
        
        // Dynamic icon switching
        document.querySelectorAll('input[name="sendMethod"]').forEach(radio => {
            radio.addEventListener('change', function() {
                if (this.value === 'whatsapp') {
                    contactIcon.className = 'input-icon fab fa-whatsapp';
                    contactIcon.style.color = '#25D366';
                } else {
                    contactIcon.className = 'input-icon fas fa-envelope';
                    contactIcon.style.color = '#EA4335';
                }
            });
        });

        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const name = document.getElementById('name').value;
            const contact = document.getElementById('contact').value;
            const subject = document.getElementById('subject').value;
            const message = document.getElementById('message').value;
            const sendMethod = document.querySelector('input[name="sendMethod"]:checked').value;
            
            // Validation
            if (sendMethod === 'email' && !contact.includes('@')) {
                alert('Please enter a valid email address');
                return;
            }
            
            if (sendMethod === 'whatsapp' && !/^[0-9+]+$/.test(contact)) {
                alert('Please enter a valid WhatsApp number');
                return;
            }
            
            // Save to Firestore
            db.collection('contacts').add({
                name: name,
                contact: contact,
                subject: subject,
                message: message,
                method: sendMethod,
                timestamp: firebase.firestore.FieldValue.serverTimestamp()
            }).catch(error => console.error('Error saving contact:', error));

            // Send via selected method
            if (sendMethod === 'whatsapp') {
                const whatsappMessage = `*New Message from ${name}*\n\n` +
                                      `*Subject:* ${subject}\n` +
                                      `*Contact:* ${contact}\n\n` +
                                      `*Message:*\n${message}`;
                window.open(`https://wa.me/97313112545?text=${encodeURIComponent(whatsappMessage)}`, '_blank');
            } else {
                const emailSubject = `Website Contact: ${subject}`;
                const emailBody = `Name: ${name}\nContact: ${contact}\n\nMessage:\n${message}`;
                window.location.href = `mailto:sanasbmt@gmail.com?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;
            }
            
            contactForm.reset();
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
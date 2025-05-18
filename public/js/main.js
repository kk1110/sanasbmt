// Import only if you need Firebase Auth or other features here
// import { auth, onAuthStateChanged } from './firebase-config.js';

document.addEventListener('DOMContentLoaded', function() {
  // Mobile Menu Toggle
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

  // ==================== WHATSAPP FLOATING BUTTON ====================
  const whatsappFloat = document.querySelector('.whatsapp-float');
  if (whatsappFloat) {
    whatsappFloat.addEventListener('click', function(e) {
      if (e.target.tagName === 'A') return;
      window.open('https://wa.me/97333553787', '_blank');
    });
  }
});

// Global cart function (if you want to keep it for future use)
function addToCart(productId) {
  // Implement your cart logic here
  console.log(`Product ${productId} added to cart`);
  alert('Product added to cart!');
}
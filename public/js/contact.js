import { db, ref, push } from './firebase-config.js';

document.addEventListener('DOMContentLoaded', function() {
  const contactForm = document.getElementById('contactForm');
  if (!contactForm) return;

  const contactIcon = document.querySelector('.input-with-icon .input-icon');

  // Dynamic icon switching
  document.querySelectorAll('input[name="sendMethod"]').forEach(radio => {
    radio.addEventListener('change', function() {
      if (!contactIcon) return;
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

    const name = document.getElementById('name').value.trim();
    const contact = document.getElementById('contact').value.trim();
    const subject = document.getElementById('subject').value.trim();
    const message = document.getElementById('message').value.trim();
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

    // Save to Realtime Database
    push(ref(db, 'contacts'), {
      name,
      contact,
      subject,
      message,
      method: sendMethod,
      timestamp: Date.now()
    }).catch(error => console.error('Error saving contact:', error));

    // Send via selected method
    if (sendMethod === 'whatsapp') {
      const whatsappMessage = `*New Message from ${name}*\n\n*Subject:* ${subject}\n*Contact:* ${contact}\n\n*Message:*\n${message}`;
      window.open(`https://wa.me/97333553787?text=${encodeURIComponent(whatsappMessage)}`, '_blank');
    } else {
      const emailSubject = `Website Contact: ${subject}`;
      const emailBody = `Name: ${name}\nContact: ${contact}\n\nMessage:\n${message}`;
      window.location.href = `mailto:sanasbmt@gmail.com?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;
    }

    contactForm.reset();
  });
});
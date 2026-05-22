// Mobile menu
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobile-menu');

if (hamburger && mobileMenu) {
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    mobileMenu.classList.toggle('open');
    document.body.style.overflow = mobileMenu.classList.contains('open') ? 'hidden' : '';
  });
  document.querySelectorAll('.mobile-nav-link').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('open');
      mobileMenu.classList.remove('open');
      document.body.style.overflow = '';
    });
  });
}

// Sticky navbar shadow
const navbar = document.getElementById('navbar');
if (navbar) {
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 20);
  }, { passive: true });
}

// Counter animation
function animateCounter(el) {
  const raw = el.getAttribute('data-target');
  const suffix = el.getAttribute('data-suffix') || '';
  const prefix = el.getAttribute('data-prefix') || '';
  const target = parseFloat(raw);
  const isDecimal = raw.includes('.');
  const duration = 1800;
  const steps = 60;
  const increment = target / steps;
  let current = 0;
  let count = 0;

  const timer = setInterval(() => {
    count++;
    current = Math.min(current + increment, target);
    el.textContent = prefix + (isDecimal ? current.toFixed(1) : Math.floor(current)) + suffix;
    if (count >= steps) clearInterval(timer);
  }, duration / steps);
}

// Intersection observer
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    if (entry.target.classList.contains('stat-number')) animateCounter(entry.target);
    if (entry.target.classList.contains('fade-in')) entry.target.classList.add('visible');
    observer.unobserve(entry.target);
  });
}, { threshold: 0.15 });

document.querySelectorAll('.stat-number, .fade-in').forEach(el => observer.observe(el));

// Contact form — AJAX submission via Formsubmit.co
const contactForm = document.getElementById('contact-form');
if (contactForm) {
  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Client-side validation
    const required = contactForm.querySelectorAll('[required]');
    let valid = true;
    required.forEach(field => {
      if (!field.value.trim()) {
        field.style.borderColor = '#EF4444';
        field.style.boxShadow = '0 0 0 3px rgba(239,68,68,0.1)';
        valid = false;
      } else {
        field.style.borderColor = '#CBD5E1';
        field.style.boxShadow = '';
      }
    });

    const errEl = document.getElementById('form-error');
    const successEl = document.getElementById('form-success');
    if (!valid) {
      if (errEl) errEl.classList.remove('hidden');
      return;
    }
    if (errEl) errEl.classList.add('hidden');

    // Disable button while sending
    const btn = document.getElementById('submit-btn');
    const originalText = btn ? btn.textContent : '';
    if (btn) { btn.disabled = true; btn.textContent = 'Sending…'; }

    try {
      const res = await fetch('https://formsubmit.co/ajax/info@printfix.co.ke', {
        method: 'POST',
        headers: { 'Accept': 'application/json' },
        body: new FormData(contactForm),
      });

      if (res.ok) {
        // Show success, hide form fields
        if (successEl) {
          successEl.classList.remove('hidden');
          successEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
        contactForm.reset();
      } else {
        throw new Error('non-ok response');
      }
    } catch (_) {
      // Network error or blocked — fall back to native submit
      contactForm.submit();
    } finally {
      if (btn) { btn.disabled = false; btn.textContent = originalText; }
    }
  });
}

// Smooth active nav highlighting
const currentPage = window.location.pathname.split('/').pop() || 'index.html';
document.querySelectorAll('.nav-link').forEach(link => {
  const href = link.getAttribute('href');
  if (href === currentPage || (currentPage === '' && href === 'index.html')) {
    link.style.color = '#F97316';
  }
});

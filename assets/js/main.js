const navToggle = document.querySelector('.nav-toggle');
const siteNav = document.querySelector('.site-nav');
const form = document.getElementById('quoteForm');
const formStatus = document.getElementById('formStatus');
const yearEl = document.getElementById('year');

if (yearEl) {
  yearEl.textContent = new Date().getFullYear();
}

if (navToggle && siteNav) {
  navToggle.addEventListener('click', () => {
    const isOpen = siteNav.classList.toggle('is-open');
    navToggle.setAttribute('aria-expanded', String(isOpen));
  });

  siteNav.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      siteNav.classList.remove('is-open');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });
}

if (form) {
  form.addEventListener('submit', (event) => {
    event.preventDefault();

    const requiredFields = [
      document.getElementById('name'),
      document.getElementById('company'),
      document.getElementById('phone'),
      document.getElementById('email'),
      document.getElementById('pickupLocation'),
      document.getElementById('deliveryLocation'),
      document.getElementById('equipmentType'),
      document.getElementById('freightDescription')
    ];

    const allValid = requiredFields.every((field) => {
      if (!field) return true;
      return field.value.trim() !== '';
    });

    if (!allValid) {
      formStatus.textContent = 'Please complete all required fields before submitting your quote request.';
      return;
    }

    formStatus.textContent = 'Thank you. Your quote request has been submitted and the Heavy Trail Logistics team will follow up soon.';
    form.reset();
  });
}

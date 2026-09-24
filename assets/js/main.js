const navToggle = document.querySelector('.nav-toggle');
const siteNav = document.querySelector('.site-nav');
const form = document.getElementById('quoteForm');
const formStatus = document.getElementById('formStatus');
const successDialog = document.getElementById('successDialog');
const successDialogClose = document.getElementById('successDialogClose');
const yearEl = document.getElementById('year');
const submitButton = form ? form.querySelector('button[type="submit"]') : null;
let lastFocusedElement = submitButton;
let isSubmitting = false;

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

function closeSuccessDialog() {
  if (!successDialog || successDialog.hasAttribute('hidden')) {
    return;
  }

  successDialog.setAttribute('hidden', 'hidden');
  successDialog.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('modal-open');

  if (lastFocusedElement && typeof lastFocusedElement.focus === 'function') {
    lastFocusedElement.focus();
  }
}

function openSuccessDialog() {
  if (!successDialog) {
    return;
  }

  lastFocusedElement = submitButton || document.activeElement;

  if (formStatus) {
    formStatus.textContent = '';
  }

  successDialog.removeAttribute('hidden');
  successDialog.setAttribute('aria-hidden', 'false');
  document.body.classList.add('modal-open');

  const dialogButton = successDialog.querySelector('button');
  if (dialogButton) {
    dialogButton.focus();
  }
}

if (successDialogClose) {
  successDialogClose.addEventListener('click', closeSuccessDialog);
}

if (successDialog) {
  successDialog.addEventListener('click', (event) => {
    if (event.target === successDialog) {
      closeSuccessDialog();
    }
  });

  document.addEventListener('keydown', (event) => {
    if (!successDialog.hasAttribute('hidden') && event.key === 'Escape') {
      closeSuccessDialog();
    }
  });
}

if (form) {
  form.addEventListener('submit', async (event) => {
    event.preventDefault();

    if (isSubmitting) {
      return;
    }

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

    const hasNativeValidityError = !form.checkValidity();
    const allValid = requiredFields.every((field) => {
      if (!field) return true;
      return field.value.trim() !== '';
    });

    if (hasNativeValidityError || !allValid) {
      form.reportValidity();
      if (formStatus) {
        formStatus.textContent = 'Please complete all required fields before submitting your quote request.';
      }
      return;
    }

    isSubmitting = true;
    if (submitButton) {
      submitButton.disabled = true;
      submitButton.setAttribute('aria-disabled', 'true');
      submitButton.textContent = 'Sending...';
    }
    if (formStatus) {
      formStatus.textContent = 'Sending your quote request...';
    }

    try {
      const response = await fetch(form.action, {
        method: 'POST',
        body: new FormData(form),
        headers: {
          Accept: 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`Form submission failed with status ${response.status}.`);
      }

      form.reset();
      openSuccessDialog();
    } catch (error) {
      if (formStatus) {
        formStatus.textContent = 'We could not send your quote request. Please try again or call us directly.';
      }
      console.error('Quote form submission failed:', error);
    } finally {
      isSubmitting = false;
      if (submitButton) {
        submitButton.disabled = false;
        submitButton.setAttribute('aria-disabled', 'false');
        submitButton.textContent = 'Submit Quote Request';
      }
    }
  });
}

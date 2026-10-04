(() => {
  const config = window.MF_CONFIG;
  if (!config) return;

  const addressQuery = [config.address, config.city, config.department, config.country].filter(Boolean).join(', ');
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(addressQuery)}`;
  const mapEmbedUrl = `https://maps.google.com/maps?q=${encodeURIComponent(addressQuery)}&ll=${encodeURIComponent(config.mapCenter)}&z=16&output=embed`;
  const waUrl = (message = config.whatsappMessage) => `https://wa.me/${config.whatsapp}?text=${encodeURIComponent(message)}`;

  if (config.siteUrl) {
    try {
      const siteUrl = new URL(config.siteUrl);
      if (siteUrl.protocol === 'https:' && !siteUrl.username && !siteUrl.password) {
        let canonical = document.querySelector('link[rel="canonical"]');
        if (!canonical) {
          canonical = document.createElement('link');
          canonical.rel = 'canonical';
          document.head.append(canonical);
        }
        canonical.href = siteUrl.href;
        let ogUrl = document.querySelector('meta[property="og:url"]');
        if (!ogUrl) {
          ogUrl = document.createElement('meta');
          ogUrl.setAttribute('property', 'og:url');
          document.head.append(ogUrl);
        }
        ogUrl.content = siteUrl.href;
      }
    } catch {
      // An unset or invalid optional public URL must not interrupt the landing.
    }
  }

  document.querySelectorAll('[data-image]').forEach((img) => {
    const image = config.images[img.dataset.image];
    if (image) {
      img.onerror = () => {
        if (!img.dataset.externalFallback) {
          img.dataset.externalFallback = 'true';
          img.src = image.src;
        } else {
          img.classList.add('image-unavailable');
        }
      };
      img.src = image.local;
    }
  });
  document.querySelectorAll('[data-year]').forEach((el) => { el.textContent = config.year; });
  document.querySelectorAll('[data-current-year]').forEach((el) => { el.textContent = new Date().getFullYear(); });
  document.querySelectorAll('[data-whatsapp-display]').forEach((el) => { el.textContent = config.whatsappDisplay; });
  document.querySelectorAll('[data-phone-display]').forEach((el) => { el.textContent = config.phone; });
  document.querySelectorAll('[data-address-lines]').forEach((el) => {
    el.replaceChildren(...[config.address, `${config.city}, ${config.department}`].map((line) => {
      const span = document.createElement('span'); span.textContent = line; return span;
    }));
  });
  document.querySelectorAll('[data-whatsapp-general]').forEach((el) => {
    el.href = waUrl(); el.target = '_blank'; el.rel = 'noopener noreferrer';
    el.setAttribute('aria-label', `Escribir a Dotaciones Industriales MF por WhatsApp al ${config.whatsappDisplay}`);
  });
  document.querySelectorAll('[data-whatsapp-product]').forEach((el) => {
    const category = el.dataset.whatsappProduct;
    el.href = waUrl(`Hola, quisiera recibir información sobre ${category} en Dotaciones Industriales MF.`);
    el.target = '_blank'; el.rel = 'noopener noreferrer';
  });
  document.querySelectorAll('[data-maps]').forEach((el) => { el.href = mapsUrl; el.target = '_blank'; el.rel = 'noopener noreferrer'; });
  document.querySelectorAll('[data-map-embed]').forEach((map) => { map.src = mapEmbedUrl; });
  document.querySelectorAll('[data-phone]').forEach((el) => { el.href = `tel:${config.phoneTel}`; });

  const menuButton = document.querySelector('.menu-toggle');
  const nav = document.querySelector('#primary-nav');
  menuButton?.addEventListener('click', () => {
    const isOpen = menuButton.getAttribute('aria-expanded') === 'true';
    menuButton.setAttribute('aria-expanded', String(!isOpen));
    menuButton.setAttribute('aria-label', isOpen ? 'Abrir menú' : 'Cerrar menú');
    nav?.classList.toggle('is-open', !isOpen);
  });
  nav?.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => {
    menuButton?.setAttribute('aria-expanded', 'false');
    menuButton?.setAttribute('aria-label', 'Abrir menú');
    nav.classList.remove('is-open');
  }));

  const form = document.querySelector('#contact-form');
  const status = document.querySelector('#form-status');
  const contactFields = ['name', 'client-type', 'visitor-phone', 'email', 'need', 'message']
    .map((id) => document.getElementById(id))
    .filter(Boolean);
  let attemptedSubmit = false;

  const validationMessage = (field) => {
    const value = field.value.trim();
    if (field.id === 'name') {
      if (!value) return 'Escribe tu nombre para continuar.';
      if (value.length < 2) return 'Escribe un nombre de al menos 2 caracteres.';
      if (value.length > 80) return 'El nombre debe tener máximo 80 caracteres.';
    }
    if (field.id === 'client-type' && !value) return 'Selecciona si eres persona o empresa.';
    if (field.id === 'visitor-phone') {
      const digits = value.replace(/\D/g, '');
      if (!value) return 'Escribe el número de WhatsApp donde podemos contactarte.';
      if (!/^\+?[\d\s().-]+$/.test(value) || digits.length < 7 || digits.length > 15) {
        return 'Revisa tu número de WhatsApp. Incluye entre 7 y 15 dígitos.';
      }
    }
    if (field.id === 'email' && value) {
      if (value.length > 120 || field.validity.typeMismatch) return 'Revisa el correo; debe tener formato nombre@dominio.com.';
    }
    if (field.id === 'need' && !value) return 'Selecciona qué necesitas.';
    if (field.id === 'message' && value && value.length < 10) return 'Cuéntanos un poco más (mínimo 10 caracteres) o deja el campo vacío.';
    if (field.id === 'message' && value.length > 500) return 'El mensaje debe tener máximo 500 caracteres.';
    return '';
  };

  const validateField = (field, showError = attemptedSubmit) => {
    const message = validationMessage(field);
    field.setCustomValidity(message);
    if (showError) {
      const error = document.getElementById(`${field.id}-error`);
      field.setAttribute('aria-invalid', String(Boolean(message)));
      if (error) {
        error.textContent = message;
        error.hidden = !message;
      }
    }
    return !message && field.checkValidity();
  };

  contactFields.forEach((field) => {
    const updateValidation = () => {
      validateField(field);
      if (attemptedSubmit && contactFields.every((contactField) => validateField(contactField, true))) {
        status.replaceChildren();
      }
    };
    field.addEventListener('input', updateValidation);
    field.addEventListener('change', updateValidation);
  });

  form?.addEventListener('submit', (event) => {
    event.preventDefault();
    attemptedSubmit = true;
    status.replaceChildren();
    if (form.elements.website.value.trim()) return;
    const invalidFields = contactFields.filter((field) => !validateField(field, true));
    if (invalidFields.length) {
      const firstInvalid = invalidFields[0];
      firstInvalid.focus();
      firstInvalid.reportValidity();
      status.textContent = 'Revisa los campos indicados para continuar.';
      return;
    }
    const data = new FormData(form);
    const message = [
      `Hola, soy ${data.get('name').trim()} (${data.get('clientType').toLowerCase()}).`,
      `Necesito información sobre ${data.get('need').toLowerCase()} y quisiera solicitar una cotización de Dotaciones Industriales MF.`,
      `Mi WhatsApp: ${data.get('visitorPhone').trim()}`,
      data.get('email').trim() ? `Correo: ${data.get('email').trim()}` : '',
      data.get('message').trim() ? `Mensaje: ${data.get('message').trim()}` : ''
    ].filter(Boolean).join('\n');
    const draftUrl = waUrl(message);
    window.open(draftUrl, '_blank', 'noopener,noreferrer');
    const fallback = document.createElement('a');
    fallback.href = draftUrl;
    fallback.target = '_blank';
    fallback.rel = 'noopener noreferrer';
    fallback.textContent = 'Abrir el borrador en WhatsApp';
    status.append(document.createTextNode('Revisa el mensaje y envíalo desde WhatsApp. Si no se abrió, '), fallback, document.createTextNode('.'));
  });

  const revealItems = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const observer = new IntersectionObserver((entries, instance) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) { entry.target.classList.add('is-visible'); instance.unobserve(entry.target); }
      });
    }, { threshold: 0.12 });
    revealItems.forEach((item) => observer.observe(item));
  } else revealItems.forEach((item) => item.classList.add('is-visible'));
})();

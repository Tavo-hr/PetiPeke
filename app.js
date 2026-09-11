/**
 * Guardería PetiPeke - Interacciones y Lógica Frontend
 * Creciendo Felices Juntos - Chala, Caravelí
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Elementos de la Barra de Navegación y Header
  const mainHeader = document.getElementById('mainHeader');
  const menuToggle = document.getElementById('menuToggle');
  const navMenu = document.getElementById('navMenu');
  const navLinks = document.querySelectorAll('.nav__link');

  // Sticky Header con sombra al hacer scroll
  const handleScroll = () => {
    if (window.scrollY > 40) {
      mainHeader.classList.add('scrolled');
    } else {
      mainHeader.classList.remove('scrolled');
    }
  };
  window.addEventListener('scroll', handleScroll);

  // Menú Hamburguesa para Móviles
  if (menuToggle && navMenu) {
    menuToggle.addEventListener('click', () => {
      const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
      menuToggle.setAttribute('aria-expanded', !isExpanded);
      menuToggle.classList.toggle('active');
      navMenu.classList.toggle('open');
    });

    // Cerrar menú al hacer clic en cualquier enlace
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        menuToggle.classList.remove('active');
        menuToggle.setAttribute('aria-expanded', 'false');
        navMenu.classList.remove('open');
      });
    });

    // Cerrar menú al hacer clic fuera del menú en móviles
    document.addEventListener('click', (e) => {
      if (navMenu.classList.contains('open') && !navMenu.contains(e.target) && !menuToggle.contains(e.target)) {
        menuToggle.classList.remove('active');
        menuToggle.setAttribute('aria-expanded', 'false');
        navMenu.classList.remove('open');
      }
    });
  }

  // 2. Active Link Observer en Scroll
  const sections = document.querySelectorAll('section[id]');
  const observerOptions = {
    root: null,
    rootMargin: '-20% 0px -60% 0px',
    threshold: 0
  };

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
      }
    });
  }, observerOptions);

  sections.forEach(section => sectionObserver.observe(section));

  // 3. Selección Rápida de Planes -> Enfocar y seleccionar en el Formulario
  const selectPlanButtons = document.querySelectorAll('.select-plan-btn');
  const serviceInterestSelect = document.getElementById('serviceInterest');
  const contactSection = document.getElementById('contacto');
  const formWrapper = document.querySelector('.form-wrapper');

  selectPlanButtons.forEach(button => {
    button.addEventListener('click', () => {
      const planName = button.getAttribute('data-plan');
      if (serviceInterestSelect && planName) {
        serviceInterestSelect.value = planName;
        
        // Scroll fluido a la sección de contacto
        if (contactSection) {
          contactSection.scrollIntoView({ behavior: 'smooth' });
          
          // Efecto visual de resalte en el formulario
          if (formWrapper) {
            formWrapper.style.transition = 'box-shadow 0.4s ease, border-color 0.4s ease';
            formWrapper.style.borderColor = 'var(--color-coral)';
            formWrapper.style.boxShadow = '0 0 25px rgba(255, 94, 54, 0.25)';
            setTimeout(() => {
              formWrapper.style.borderColor = '#edf2f7';
              formWrapper.style.boxShadow = 'var(--shadow-md)';
            }, 1600);
          }
        }
      }
    });
  });

  // 4. Formulario de Admisión e Informes
  const admissionForm = document.getElementById('admissionForm');
  const whatsappSubmitBtn = document.getElementById('whatsappSubmitBtn');
  const formFeedback = document.getElementById('formFeedback');

  const inputs = {
    parentName: document.getElementById('parentName'),
    childName: document.getElementById('childName'),
    childAge: document.getElementById('childAge'),
    phone: document.getElementById('phone'),
    serviceInterest: document.getElementById('serviceInterest'),
    message: document.getElementById('message')
  };

  const errors = {
    parentName: document.getElementById('parentNameError'),
    childName: document.getElementById('childNameError'),
    childAge: document.getElementById('childAgeError'),
    phone: document.getElementById('phoneError'),
    serviceInterest: document.getElementById('serviceInterestError')
  };

  // Validación de campo individual
  const validateField = (fieldName) => {
    const input = inputs[fieldName];
    const error = errors[fieldName];
    if (!input || !error) return true;

    let isValid = true;
    const value = input.value.trim();

    if (fieldName === 'phone') {
      // Al menos 7 caracteres numéricos o de teléfono
      isValid = value.length >= 7;
    } else {
      isValid = value.length > 0;
    }

    if (!isValid) {
      input.classList.add('is-invalid');
      error.classList.add('active');
    } else {
      input.classList.remove('is-invalid');
      error.classList.remove('active');
    }

    return isValid;
  };

  // Escuchar inputs para limpiar errores al escribir
  Object.keys(inputs).forEach(key => {
    const input = inputs[key];
    if (input) {
      input.addEventListener('input', () => {
        if (errors[key]) {
          input.classList.remove('is-invalid');
          errors[key].classList.remove('active');
        }
      });
      if (input.tagName === 'SELECT') {
        input.addEventListener('change', () => {
          if (errors[key]) {
            input.classList.remove('is-invalid');
            errors[key].classList.remove('active');
          }
        });
      }
    }
  });

  // Validar todos los campos obligatorios
  const validateAll = () => {
    const isParentValid = validateField('parentName');
    const isChildValid = validateField('childName');
    const isAgeValid = validateField('childAge');
    const isPhoneValid = validateField('phone');
    const isServiceValid = validateField('serviceInterest');

    return isParentValid && isChildValid && isAgeValid && isPhoneValid && isServiceValid;
  };

  // Construir mensaje estructurado para WhatsApp
  const buildWhatsAppMessage = () => {
    const parentName = inputs.parentName.value.trim();
    const childName = inputs.childName.value.trim();
    const childAge = inputs.childAge.value.trim();
    const phone = inputs.phone.value.trim();
    const service = inputs.serviceInterest.value.trim();
    const userMsg = inputs.message.value.trim();

    let msg = `👶 *Consulta de Admisión - Guardería PetiPeke*\n\n`;
    if (parentName) msg += `👤 *Apoderado:* ${parentName}\n`;
    if (childName) msg += `🧸 *Pequeño(a):* ${childName}\n`;
    if (childAge) msg += `🎂 *Edad:* ${childAge}\n`;
    if (phone) msg += `📱 *Teléfono:* ${phone}\n`;
    if (service) msg += `📋 *Servicio de Interés:* ${service}\n`;
    if (userMsg) msg += `💬 *Consulta:* ${userMsg}\n`;
    msg += `\n¡Muchas gracias! Quedo a la espera de su respuesta.`;

    return encodeURIComponent(msg);
  };

  // Envío tradicional del Formulario
  if (admissionForm) {
    admissionForm.addEventListener('submit', (e) => {
      e.preventDefault();

      if (!validateAll()) {
        formFeedback.className = 'form-feedback';
        formFeedback.style.display = 'block';
        formFeedback.style.backgroundColor = '#fed7d7';
        formFeedback.style.color = '#9b2c2c';
        formFeedback.style.border = '1px solid #feb2b2';
        formFeedback.innerHTML = `<i class="fa-solid fa-triangle-exclamation"></i> Por favor completa todos los campos requeridos con información válida.`;
        return;
      }

      const parentName = inputs.parentName.value.trim();
      const encodedMsg = buildWhatsAppMessage();

      // Éxito en pantalla
      formFeedback.className = 'form-feedback success';
      formFeedback.style.display = 'block';
      formFeedback.innerHTML = `
        <i class="fa-solid fa-circle-check" style="font-size: 1.3rem; margin-bottom: 0.5rem; display: block;"></i>
        <strong>¡Muchas gracias, ${parentName}!</strong><br>
        Hemos recibido tus datos con éxito. Nuestro equipo se comunicará contigo al ${inputs.phone.value.trim()} muy pronto.<br>
        <div style="margin-top: 1rem;">
          <a href="https://wa.me/51961489617?text=${encodedMsg}" target="_blank" rel="noopener noreferrer" class="btn btn--whatsapp btn--sm" style="color: #fff;">
            <i class="fa-brands fa-whatsapp"></i> Abrir también en WhatsApp
          </a>
        </div>
      `;

      admissionForm.reset();
    });
  }

  // Botón directo para enviar a WhatsApp
  if (whatsappSubmitBtn) {
    whatsappSubmitBtn.addEventListener('click', () => {
      // Validar si es posible
      const isValid = validateAll();
      const encodedMsg = buildWhatsAppMessage();
      const whatsappUrl = `https://wa.me/51961489617?text=${encodedMsg}`;

      if (!isValid) {
        // Alerta si faltan datos pero permitir al usuario abrir WhatsApp si desea
        const confirmSend = confirm("Faltan algunos datos por completar en el formulario. ¿Deseas abrir WhatsApp directamente de todas formas?");
        if (confirmSend) {
          window.open(whatsappUrl, '_blank');
        }
      } else {
        window.open(whatsappUrl, '_blank');
      }
    });
  }
});

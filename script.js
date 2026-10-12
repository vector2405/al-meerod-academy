const menuToggle = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');

if (menuToggle && navLinks) {
  menuToggle.addEventListener('click', () => {
    const open = navLinks.classList.toggle('open');
    menuToggle.setAttribute('aria-expanded', String(open));
    menuToggle.textContent = open ? '✕' : '☰';
  });

  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      menuToggle.setAttribute('aria-expanded', 'false');
      menuToggle.textContent = '☰';
    });
  });
}

const yearElement = document.getElementById('year');

if (yearElement) {
  yearElement.textContent = new Date().getFullYear();
}

const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

const sections = document.querySelectorAll('main section[id]');
const links = document.querySelectorAll('.nav-links a[href^="#"]');
window.addEventListener('scroll', () => {
  let current = 'home';
  sections.forEach(section => {
    if (window.scrollY >= section.offsetTop - 150) current = section.id;
  });
  links.forEach(link => {
    link.classList.toggle('active', link.getAttribute('href') === `#${current}`);
  });
}, { passive: true });

const enquiryForm = document.getElementById('enquiry-form');

if (enquiryForm) {
    const whatsappButton = document.getElementById('whatsapp-submit');
    const status = enquiryForm.querySelector('.form-status');

    // School's official WhatsApp number
    const schoolWhatsApp = '2348039597199';

    // Collect and validate form information
    function getEnquiryDetails() {
        const name = enquiryForm.querySelector('[name="name"]').value.trim();
        const phone = enquiryForm.querySelector('[name="phone"]').value.trim();
        const programme = enquiryForm.querySelector('[name="programme"]').value.trim();
        const message = enquiryForm.querySelector('[name="message"]').value.trim();

        if (!name || !phone || !programme || !message) {
            if (status) {
                status.textContent = 'Please complete all the fields.';
            }
            return null;
        }

        const enquiryMessage =
            `AL-MEEROOD ACADEMY ENQUIRY\n\n` +
            `Name: ${name}\n` +
            `Phone: ${phone}\n` +
            `Programme: ${programme}\n\n` +
            `Enquiry: ${message}`;

        return enquiryMessage;
    }

    // WhatsApp button
    if (whatsappButton) {
        whatsappButton.addEventListener('click', function () {
            const enquiryMessage = getEnquiryDetails();

            if (!enquiryMessage) return;

            const whatsappURL =
                `https://wa.me/${schoolWhatsApp}?text=` +
                encodeURIComponent(enquiryMessage);

            window.open(whatsappURL, '_blank');

            if (status) {
                status.textContent =
                    'WhatsApp is opening. Send the prepared message to the school.';
            }
        });
    }

  // Email button: submit the form to FormSubmit
enquiryForm.addEventListener('submit', async function (event) {
    event.preventDefault();

    const enquiryMessage = getEnquiryDetails();

    if (!enquiryMessage) return;

    if (status) {
        status.textContent = 'Sending your enquiry...';
    }

    const formData = new FormData(enquiryForm);

    try {
        const response = await fetch(
            'https://formsubmit.co/ajax/almeerodacademy026@gmail.com',
            {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            }
        );

        const result = await response.json();

        if (response.ok && result.success) {
            if (status) {
                status.textContent =
                    'Thank you! Your enquiry has been sent to Al-Meerod Academy.';
            }

            enquiryForm.reset();
        } else {
            if (status) {
                status.textContent =
                    'We could not send your enquiry. Please contact the school through WhatsApp.';
            }
        }
    } catch (error) {
        if (status) {
            status.textContent =
                'Connection problem. Please try again or contact the school through WhatsApp.';
        }
    }
});
}
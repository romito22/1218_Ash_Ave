/* ── GALLERY (GLightbox) ── */
const lightbox = GLightbox({ selector: '.glightbox', touchNavigation: true, loop: true });

/* ── 360° TOUR (Pannellum) ── */
/*
  HOW TO ADD 360° PHOTOS:
  1. Put your equirectangular .jpg files in images/360/
  2. Add a room to the `rooms` array below:
       { id: 'living-room', label: 'Living Room', src: 'images/360/living-room.jpg' }
  3. Add a tab button in index.html matching the id, OR let the script auto-generate tabs.

  The first room loads automatically when the page loads.
*/

const rooms = [
  // { id: 'living-room', label: 'Living Room', src: 'images/360/living-room.jpg' },
  // { id: 'kitchen',     label: 'Kitchen',     src: 'images/360/kitchen.jpg'     },
  // { id: 'bedroom',     label: 'Bedroom',     src: 'images/360/bedroom.jpg'     },
];

let currentViewer = null;

function loadPanorama(room) {
  const container = document.getElementById('panorama-viewer');
  const placeholder = document.getElementById('panoPlaceholder');

  if (!room) return;

  if (placeholder) placeholder.remove();

  if (currentViewer) {
    currentViewer.destroy();
    currentViewer = null;
  }

  // Ensure the div#panorama exists
  let panoDiv = document.getElementById('panorama');
  if (!panoDiv) {
    panoDiv = document.createElement('div');
    panoDiv.id = 'panorama';
    container.appendChild(panoDiv);
  }

  currentViewer = pannellum.viewer('panorama', {
    type: 'equirectangular',
    panorama: room.src,
    autoLoad: true,
    autoRotate: -2,
    compass: false,
    showControls: true,
    hfov: 100,
  });
}

function buildTabs() {
  if (rooms.length === 0) return;

  const tabsContainer = document.getElementById('tourTabs');
  tabsContainer.innerHTML = '';

  rooms.forEach((room, i) => {
    const btn = document.createElement('button');
    btn.className = 'tab-btn' + (i === 0 ? ' active' : '');
    btn.textContent = room.label;
    btn.dataset.room = room.id;
    btn.addEventListener('click', () => {
      document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      loadPanorama(room);
    });
    tabsContainer.appendChild(btn);
  });

  loadPanorama(rooms[0]);
}

buildTabs();

/* ── CONTACT FORM ── */
/*
  The form uses Formspree by default (free, no backend needed).
  Replace YOUR_FORM_ID below with your actual Formspree form ID,
  OR swap the fetch URL for any other form service.

  To get a Formspree ID:
  1. Go to https://formspree.io
  2. Create a new form pointing to your email
  3. Copy the form ID (e.g. "xpwzabcd")
*/
const FORMSPREE_ID = 'YOUR_FORM_ID'; // ← replace this

const form = document.getElementById('contactForm');
const note = document.getElementById('formNote');

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  if (FORMSPREE_ID === 'YOUR_FORM_ID') {
    note.textContent = '✓ (Demo mode) Form ready — add your Formspree ID in script.js to receive emails.';
    note.style.color = 'var(--accent)';
    return;
  }

  const btn = form.querySelector('button[type="submit"]');
  btn.textContent = 'Sending…';
  btn.disabled = true;

  try {
    const res = await fetch(`https://formspree.io/f/${FORMSPREE_ID}`, {
      method: 'POST',
      headers: { 'Accept': 'application/json' },
      body: new FormData(form),
    });

    if (res.ok) {
      note.textContent = '✓ Message sent! We'll be in touch soon.';
      note.style.color = 'var(--accent)';
      form.reset();
    } else {
      throw new Error();
    }
  } catch {
    note.textContent = '✗ Something went wrong. Please email us directly.';
    note.style.color = '#dc2626';
  } finally {
    btn.textContent = 'Send Message';
    btn.disabled = false;
  }
});

/* ── NAVBAR SCROLL SHADOW ── */
const navbar = document.querySelector('.navbar');
window.addEventListener('scroll', () => {
  navbar.style.boxShadow = window.scrollY > 10 ? '0 2px 12px rgba(0,0,0,.08)' : 'none';
}, { passive: true });

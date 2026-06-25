/* ── GALLERY (GLightbox) ── */
let lightbox;
try { lightbox = GLightbox({ selector: '.glightbox', touchNavigation: true, loop: true }); } catch(e) {}

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
  { id: 'room-1', label: 'Living Room (View 1)', src: 'images/360/room-1.jpg' },
  { id: 'room-2', label: 'Living Room (View 2)', src: 'images/360/room-2.jpg' },
  { id: 'room-3', label: 'Bathroom',             src: 'images/360/room-3.jpg' },
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
    yaw: 180,
    pitch: 0,
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


/* ── EDITABLE CAPTIONS (localStorage) ── */
document.querySelectorAll('[contenteditable][data-key]').forEach(el => {
  const key = 'ash-' + el.dataset.key;
  const saved = localStorage.getItem(key);
  if (saved) el.textContent = saved;
  el.addEventListener('blur', () => localStorage.setItem(key, el.textContent.trim()));
  el.addEventListener('keydown', e => { if (e.key === 'Enter') { e.preventDefault(); el.blur(); } });
});

/* ── CONTACT OBFUSCATION (anti-bot) ── */
(function () {
  const p = ['77', '0', '33', '1', '14', '58'];
  const phone = p.join('');
  const e = ['alex', 'p', 'dunlap', '@', 'gmail', '.', 'com'];
  const email = e.join('');

  const elP = document.getElementById('contact-phone');
  const elE = document.getElementById('contact-email');
  if (elP) { elP.textContent = '(' + phone.slice(0,3) + ') ' + phone.slice(3,6) + '-' + phone.slice(6); elP.href = 'tel:+1' + phone; }
  if (elE) { elE.textContent = email; elE.href = 'mailto:' + email; }
})();

/* ── NAVBAR SCROLL SHADOW ── */
const navbar = document.querySelector('.navbar');
window.addEventListener('scroll', () => {
  navbar.style.boxShadow = window.scrollY > 10 ? '0 2px 12px rgba(0,0,0,.08)' : 'none';
}, { passive: true });

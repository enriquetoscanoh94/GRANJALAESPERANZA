/* ==========================================================================
   Granja La Esperanza — JavaScript
   ========================================================================== */

/* --- Menú móvil --- */
function toggleMenu() {
  document.getElementById('menu').classList.toggle('open');
}

/* --- Carrusel manual (una foto a la vez, con flechas; sin autoplay) --- */
function initCarousel(carousel) {
  const slides = carousel.querySelectorAll('.carousel-slide');
  const btnPrev = carousel.querySelector('.carousel-btn.prev');
  const btnNext = carousel.querySelector('.carousel-btn.next');
  const current = carousel.querySelector('.carousel-counter .cur');
  const dotsBox = carousel.nextElementSibling;
  let index = 0;

  // Crear los puntos (dots)
  slides.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.setAttribute('aria-label', 'Ir a la foto ' + (i + 1));
    dot.addEventListener('click', () => show(i));
    dotsBox.appendChild(dot);
  });
  const dots = dotsBox.querySelectorAll('button');

  function show(i) {
    index = (i + slides.length) % slides.length;
    slides.forEach((s, n) => s.classList.toggle('active', n === index));
    dots.forEach((d, n) => d.classList.toggle('active', n === index));
    if (current) current.textContent = index + 1;
  }

  btnPrev.addEventListener('click', () => show(index - 1));
  btnNext.addEventListener('click', () => show(index + 1));

  // Deslizar con el dedo en móvil
  let startX = 0;
  carousel.addEventListener('touchstart', (e) => { startX = e.touches[0].clientX; }, { passive: true });
  carousel.addEventListener('touchend', (e) => {
    const diff = e.changedTouches[0].clientX - startX;
    if (diff > 50) show(index - 1);
    else if (diff < -50) show(index + 1);
  }, { passive: true });

  show(0);
}

document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('[data-carousel]').forEach(initCarousel);
});

/* ==========================================================================
   Granja La Esperanza — JavaScript
   ========================================================================== */

/* --- Menú móvil --- */
function toggleMenu() {
  document.getElementById('menu').classList.toggle('open');
}

/* --- Galería: filtros + lightbox --- */
document.addEventListener('DOMContentLoaded', () => {
  const galleries = Array.from(document.querySelectorAll('.gallery'));
  if (!galleries.length) return;

  const allItems = Array.from(document.querySelectorAll('.gal-item'));

  /* ----- Filtros (cada barra de chips filtra la galería que le sigue) ----- */
  document.querySelectorAll('.gal-filters').forEach(bar => {
    const gallery = bar.nextElementSibling;
    if (!gallery || !gallery.classList.contains('gallery')) return;
    const chips = bar.querySelectorAll('.gal-chip');
    const items = gallery.querySelectorAll('.gal-item');
    chips.forEach(chip => {
      chip.addEventListener('click', () => {
        chips.forEach(c => c.classList.remove('active'));
        chip.classList.add('active');
        const filter = chip.dataset.filter;
        items.forEach(item => {
          const show = filter === 'all' || item.dataset.cat === filter;
          item.classList.toggle('hide', !show);
        });
        gallery.scrollTo({ left: 0 }); // volver al inicio del carrusel
        gallery.dispatchEvent(new Event('scroll'));
      });
    });
  });

  /* ----- Carrusel: flechas para deslizar ----- */
  galleries.forEach(g => {
    const wrap = document.createElement('div');
    wrap.className = 'gal-carousel';
    g.parentNode.insertBefore(wrap, g);
    wrap.appendChild(g);

    const prev = document.createElement('button');
    prev.className = 'gal-arrow prev';
    prev.setAttribute('aria-label', 'Anterior');
    prev.innerHTML = '‹';
    const next = document.createElement('button');
    next.className = 'gal-arrow next';
    next.setAttribute('aria-label', 'Siguiente');
    next.innerHTML = '›';
    wrap.appendChild(prev);
    wrap.appendChild(next);

    const page = () => Math.max(g.clientWidth * 0.85, 260);
    prev.addEventListener('click', () => g.scrollBy({ left: -page(), behavior: 'smooth' }));
    next.addEventListener('click', () => g.scrollBy({ left: page(), behavior: 'smooth' }));

    const updateArrows = () => {
      prev.hidden = g.scrollLeft <= 4;
      next.hidden = g.scrollLeft + g.clientWidth >= g.scrollWidth - 4;
    };
    g.addEventListener('scroll', updateArrows, { passive: true });
    window.addEventListener('resize', updateArrows);
    updateArrows();
  });

  /* ----- Lightbox ----- */
  const lb = document.getElementById('lightbox');
  const lbImg = document.getElementById('lbImg');
  const lbCap = document.getElementById('lbCap');
  const lbCur = document.getElementById('lbCur');
  const lbTotal = document.getElementById('lbTotal');
  let visibles = [];
  let pos = 0;

  function openLightbox(item) {
    // Navega solo dentro de su galería y respetando el filtro actual
    const gallery = item.closest('.gallery');
    visibles = Array.from(gallery.querySelectorAll('.gal-item')).filter(i => !i.classList.contains('hide'));
    pos = visibles.indexOf(item);
    lbTotal.textContent = visibles.length;
    render();
    lb.classList.add('open');
    lb.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function render() {
    const item = visibles[pos];
    const img = item.querySelector('img');
    const cap = item.querySelector('figcaption');
    lbImg.src = img.src;
    lbImg.alt = img.alt;
    lbCap.innerHTML = cap ? cap.innerHTML : '';
    lbCur.textContent = pos + 1;
  }

  function move(dir) {
    pos = (pos + dir + visibles.length) % visibles.length;
    render();
  }

  function closeLightbox() {
    lb.classList.remove('open');
    lb.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  allItems.forEach(item => item.addEventListener('click', () => openLightbox(item)));
  lb.querySelector('.lb-next').addEventListener('click', e => { e.stopPropagation(); move(1); });
  lb.querySelector('.lb-prev').addEventListener('click', e => { e.stopPropagation(); move(-1); });
  lb.querySelector('.lb-close').addEventListener('click', closeLightbox);
  lb.addEventListener('click', e => { if (e.target === lb) closeLightbox(); });

  document.addEventListener('keydown', e => {
    if (!lb.classList.contains('open')) return;
    if (e.key === 'Escape') closeLightbox();
    else if (e.key === 'ArrowRight') move(1);
    else if (e.key === 'ArrowLeft') move(-1);
  });

  // Deslizar con el dedo en el lightbox
  let startX = 0;
  lb.addEventListener('touchstart', e => { startX = e.touches[0].clientX; }, { passive: true });
  lb.addEventListener('touchend', e => {
    const diff = e.changedTouches[0].clientX - startX;
    if (diff > 50) move(-1);
    else if (diff < -50) move(1);
  }, { passive: true });
});
